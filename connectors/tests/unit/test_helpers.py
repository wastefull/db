"""
Unit tests for helpers.py module.
"""

import pytest
import os
import tempfile
from unittest.mock import Mock, patch, mock_open
import requests

from helpers import gl, gf, get_secret, any_missing, UnsplashHelper


class TestBasicHelpers:
    """Test basic helper functions."""

    def test_gl_valid_index(self):
        """Test gl function with valid index."""
        lines = ["line 0", "line 1", "line 2"]
        assert gl(lines, 0) == "line 0"
        assert gl(lines, 1) == "line 1"
        assert gl(lines, 2) == "line 2"

    def test_gl_invalid_index(self):
        """Test gl function with invalid index."""
        lines = ["line 0", "line 1"]

        with pytest.raises(IndexError):
            gl(lines, -1)

        with pytest.raises(IndexError):
            gl(lines, 2)

    def test_gl_strips_whitespace(self):
        """Test that gl strips whitespace."""
        lines = ["  line with spaces  ", "\tline with tabs\t"]
        assert gl(lines, 0) == "line with spaces"
        assert gl(lines, 1) == "line with tabs"

    def test_gf_existing_field(self):
        """Test gf function with existing field."""
        data = {"key1": "value1", "key2": "value2"}
        assert gf("key1", data) == "value1"
        assert gf("key2", data) == "value2"

    def test_gf_missing_field(self):
        """Test gf function with missing field."""
        data = {"key1": "value1"}
        assert gf("missing_key", data) is None

    def test_gf_empty_dict(self):
        """Test gf function with empty dictionary."""
        assert gf("any_key", {}) is None


class TestGetSecret:
    """Test get_secret function."""

    def test_get_secret_from_env(self, mock_env_vars):
        """Test getting secret from environment variables."""
        result = get_secret("AIRTABLE_API_KEY")
        assert result == "test_key_123"

    @patch.dict(os.environ, {}, clear=True)
    def test_get_secret_from_env_file(self):
        """Test getting secret from .env file."""
        env_content = "AIRTABLE_API_KEY=env_file_key\nOTHER_VAR=other_value"

        with patch("builtins.open", mock_open(read_data=env_content)):
            with patch("os.path.exists", return_value=True):
                result = get_secret("AIRTABLE_API_KEY")
                assert result == "env_file_key"

    @patch.dict(os.environ, {}, clear=True)
    def test_get_secret_from_secrets_file(self):
        """Test getting secret from legacy secrets file."""
        secrets_content = "secret1\nsecret2\nsecret3"

        with patch("builtins.open", mock_open(read_data=secrets_content)):
            with patch("os.path.exists") as mock_exists:
                # .env file doesn't exist, but secrets file does
                mock_exists.side_effect = lambda path: "secrets.txt" in path

                result = get_secret("TEST_VAR", fallback_line=1)
                assert result == "secret2"

    @patch.dict(os.environ, {}, clear=True)
    def test_get_secret_not_found(self):
        """Test when secret is not found anywhere."""
        with patch("os.path.exists", return_value=False):
            result = get_secret("NONEXISTENT_VAR")
            assert result is None

    @patch.dict(os.environ, {}, clear=True)
    def test_get_secret_env_file_error(self):
        """Test handling of .env file read errors."""
        with patch("os.path.exists", return_value=True):
            with patch("builtins.open", side_effect=IOError("File read error")):
                result = get_secret("TEST_VAR")
                assert result is None


class TestAnyMissing:
    """Test any_missing function."""

    def test_any_missing_none_missing(self):
        """Test when no required keys are missing."""
        required = ["key1", "key2", "key3"]
        provided = {"key1": "value1", "key2": "value2",
                    "key3": "value3", "extra": "extra_value"}

        assert any_missing(required, provided) is False

    def test_any_missing_some_missing(self, capsys):
        """Test when some required keys are missing."""
        required = ["key1", "key2", "key3"]
        provided = {"key1": "value1", "key3": "value3"}

        result = any_missing(required, provided)
        assert result is True

        captured = capsys.readouterr()
        assert "Missing required keys" in captured.out
        assert "Missing key: key2" in captured.out

    def test_any_missing_all_missing(self, capsys):
        """Test when all required keys are missing."""
        required = ["key1", "key2"]
        provided = {}

        result = any_missing(required, provided)
        assert result is True

        captured = capsys.readouterr()
        assert "Missing key: key1" in captured.out
        assert "Missing key: key2" in captured.out

    def test_any_missing_empty_required(self):
        """Test with empty required list."""
        required = []
        provided = {"key1": "value1"}

        assert any_missing(required, provided) is False


class TestUnsplashHelper:
    """Test UnsplashHelper class."""

    def test_init_with_valid_keys(self, mock_env_vars):
        """Test UnsplashHelper initialization with valid keys."""
        helper = UnsplashHelper()
        assert helper.access_key == "test_unsplash_key"
        assert helper.secret_key == "test_unsplash_secret"
        assert "Accept" in helper.headers
        assert "Accept-Version" in helper.headers

    @patch.dict(os.environ, {}, clear=True)
    @patch('helpers.get_secret', return_value=None)
    def test_init_missing_access_key(self, mock_get_secret):
        """Test UnsplashHelper initialization without access key."""
        with pytest.raises(ValueError, match="UNSPLASH_AK environment variable not set"):
            UnsplashHelper()

    def test_clean_query_basic(self):
        """Test basic query cleaning."""
        helper = UnsplashHelper.__new__(
            UnsplashHelper)  # Create without __init__

        assert helper.clean_query("plastic bottle") == "plastic bottle"
        assert helper.clean_query(
            "aluminum can recycling") == "aluminum can recycling"

    def test_clean_query_with_parentheses(self):
        """Test query cleaning with parentheses removal."""
        helper = UnsplashHelper.__new__(UnsplashHelper)

        assert helper.clean_query("plastic bottle (PET)") == "plastic bottle"
        assert helper.clean_query(
            "aluminum (metal) recycling") == "aluminum recycling"
        assert helper.clean_query("(unwanted) text") == "text"

    def test_clean_query_length_limit(self):
        """Test query length limiting."""
        helper = UnsplashHelper.__new__(UnsplashHelper)

        long_query = "this is a very long query that exceeds the 36 character limit"
        result = helper.clean_query(long_query)
        assert len(result) <= 36
        assert result == "this is a very long query that excee"

    def test_clean_query_empty_and_whitespace(self):
        """Test query cleaning with empty and whitespace strings."""
        helper = UnsplashHelper.__new__(UnsplashHelper)

        assert helper.clean_query("") == ""
        assert helper.clean_query("   ") == ""
        assert helper.clean_query("\t\n") == ""  # Real tab and newline
        assert helper.clean_query("  spaced  words  ") == "spaced words"

    @patch('requests.get')
    def test_get_random_image_success(self, mock_get, mock_env_vars):
        """Test successful image retrieval."""
        # Mock successful API response
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = [{
            "urls": {
                "small": "https://example.com/small.jpg",
                "regular": "https://example.com/regular.jpg",
                "thumb": "https://example.com/thumb.jpg"
            },
            "user": {
                "username": "test_photographer",
                "links": {
                    "self": "https://example.com/photographer"
                }
            }
        }]
        mock_get.return_value = mock_response

        helper = UnsplashHelper()
        result = helper.get_random_image("plastic bottle")

        assert result["url"] == "https://example.com/small.jpg"
        assert result["thumbnail_url"] == "https://example.com/thumb.jpg"
        assert result["photographer"]["username"] == "test_photographer"
        assert result["photographer"]["profile_url"] == "https://example.com/photographer"

    @patch('requests.get')
    def test_get_random_image_fallback_url(self, mock_get, mock_env_vars):
        """Test image retrieval with fallback to regular URL."""
        # Mock response with no small URL
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = [{
            "urls": {
                "small": None,
                "regular": "https://example.com/regular.jpg",
                "thumb": "https://example.com/thumb.jpg"
            },
            "user": {
                "username": "test_photographer",
                "links": {"self": "https://example.com/photographer"}
            }
        }]
        mock_get.return_value = mock_response

        helper = UnsplashHelper()
        result = helper.get_random_image("test query")

        assert result["url"] == "https://example.com/regular.jpg"

    @patch('requests.get')
    def test_get_random_image_api_error(self, mock_get, mock_env_vars):
        """Test handling of API errors."""
        # Mock failed API response
        mock_response = Mock()
        mock_response.status_code = 404
        mock_get.return_value = mock_response

        helper = UnsplashHelper()

        with pytest.raises(RuntimeError, match="Unsplash API request failed with status 404"):
            helper.get_random_image("test query")

    @patch('requests.get')
    def test_get_random_image_query_cleaning(self, mock_get, mock_env_vars):
        """Test that query is properly cleaned before API call."""
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = [{
            "urls": {"small": "test.jpg", "thumb": "thumb.jpg"},
            "user": {"username": "test", "links": {"self": "test.com"}}
        }]
        mock_get.return_value = mock_response

        helper = UnsplashHelper()
        helper.get_random_image("plastic bottle (PET) recycling method")

        # Verify the API was called with cleaned query
        mock_get.assert_called_once()
        call_url = mock_get.call_args[0][0]
        assert "query=plastic bottle recycling method" in call_url
        assert "(PET)" not in call_url
