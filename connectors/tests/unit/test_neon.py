"""
Unit tests for neon.py module.
"""

import pytest
from unittest.mock import Mock, patch, MagicMock
import psycopg2

from neon import NeonConnect


class TestNeonConnect:
    """Test NeonConnect class."""

    @patch('psycopg2.connect')
    def test_init_success(self, mock_connect, mock_env_vars):
        """Test successful NeonConnect initialization."""
        # Mock successful connection test
        mock_connection = Mock()
        mock_connect.return_value = mock_connection

        with patch.object(NeonConnect, 'test_connection', return_value=True):
            connector = NeonConnect()

            # Verify initialization completed without errors
            assert connector is not None

    @patch('psycopg2.connect')
    def test_init_connection_failure(self, mock_connect, mock_env_vars):
        """Test initialization failure when connection test fails."""
        with patch.object(NeonConnect, 'test_connection', return_value=False):
            with pytest.raises(ConnectionError, match="Connection to Neon database failed"):
                NeonConnect()

    @patch.dict('os.environ', {}, clear=True)
    def test_fetch_deets_missing_uri(self):
        """Test fetch_deets when POSTGRES_URI is missing."""
        with patch('neon.get_secret', return_value=None):
            connector = NeonConnect.__new__(
                NeonConnect)  # Create without __init__

            with pytest.raises(ValueError, match="Connection string is missing"):
                connector.fetch_deets()

    def test_fetch_deets_empty_uri(self):
        """Test fetch_deets when POSTGRES_URI is empty."""
        with patch('neon.get_secret', return_value=""):
            connector = NeonConnect.__new__(NeonConnect)

            with pytest.raises(ValueError, match="Connection string is missing"):
                connector.fetch_deets()

    def test_fetch_deets_success(self, mock_env_vars):
        """Test successful fetch_deets."""
        test_uri = "postgresql://test:test@localhost:5432/test"

        with patch('neon.get_secret', return_value=test_uri):
            connector = NeonConnect.__new__(NeonConnect)
            result = connector.fetch_deets()

            assert result == test_uri

    @patch('psycopg2.connect')
    def test_connect_success(self, mock_connect, mock_env_vars):
        """Test successful database connection."""
        mock_connection = Mock()
        mock_connect.return_value = mock_connection

        connector = NeonConnect.__new__(NeonConnect)
        result = connector.connect()

        assert result == mock_connection
        assert connector.c == mock_connection
        mock_connect.assert_called_once()

    @patch('psycopg2.connect')
    def test_connect_failure(self, mock_connect, mock_env_vars):
        """Test database connection failure."""
        mock_connect.side_effect = psycopg2.Error("Connection failed")

        connector = NeonConnect.__new__(NeonConnect)

        with pytest.raises(psycopg2.Error):
            connector.connect()

    @patch('psycopg2.connect')
    def test_test_connection_success(self, mock_connect):
        """Test successful connection test."""
        mock_connection = Mock()
        mock_connect.return_value = mock_connection

        connector = NeonConnect.__new__(NeonConnect)
        result = connector.test_connection(
            "postgresql://test:test@localhost:5432/test")

        assert result is True
        mock_connect.assert_called_once_with(
            "postgresql://test:test@localhost:5432/test")
        mock_connection.close.assert_called_once()

    @patch('psycopg2.connect')
    def test_test_connection_failure(self, mock_connect):
        """Test connection test failure."""
        mock_connect.side_effect = psycopg2.Error("Connection failed")

        connector = NeonConnect.__new__(NeonConnect)
        
        # The function raises the exception, doesn't return False
        with pytest.raises(psycopg2.Error):
            connector.test_connection("invalid://connection")

    @patch('psycopg2.connect')
    def test_update_neon_data_success(self, mock_connect):
        """Test successful data update."""
        # Mock connection and cursor
        mock_connection = Mock()
        mock_cursor = Mock()
        mock_connection.cursor.return_value = mock_cursor
        mock_connect.return_value = mock_connection

        # Sample data with required 'id' field
        test_data = [
            {"id": "1", "item": "plastic bottle", "type": "recycling", "method": "DIY"},
            {"id": "2", "item": "aluminum can", "type": "recycling", "method": "Industrial"}
        ]

        connector = NeonConnect.__new__(NeonConnect)

        # Mock the connect method to avoid calling __init__
        with patch.object(connector, 'connect', return_value=mock_connection):
            with patch.object(connector, 'create_upsert_query', return_value="INSERT QUERY"):
                connector.update_neon_data(test_data)

                # Verify connection and cursor setup
                assert connector.c == mock_connection
                assert connector.cr == mock_cursor

                # Verify SQL operations were called
                assert mock_cursor.execute.call_count == len(test_data)
                mock_connection.commit.assert_called_once()

    @patch('psycopg2.connect')
    def test_update_neon_data_no_cursor(self, mock_connect):
        """Test update_neon_data when cursor creation fails."""
        mock_connection = Mock()
        mock_connection.cursor.return_value = None
        mock_connect.return_value = mock_connection

        connector = NeonConnect.__new__(NeonConnect)
        test_data = [{"id": "1", "item": "test"}]

        with patch.object(connector, 'connect', return_value=mock_connection):
            # Should raise ValueError when cursor is None
            with pytest.raises(ValueError, match="No cursor to cook and update data"):
                connector.update_neon_data(test_data)

    @patch('psycopg2.connect')
    def test_search_data_by_name_success(self, mock_connect):
        """Test successful data search by name."""
        # Mock connection and cursor with search results
        mock_connection = Mock()
        mock_cursor = Mock()
        mock_connection.cursor.return_value = mock_cursor
        mock_connect.return_value = mock_connection

        # Mock search results
        mock_results = [
            ("plastic bottle", "recycling", "DIY",
             "How to recycle plastic bottles"),
            ("aluminum can", "recycling", "Industrial",
             "Industrial aluminum recycling")
        ]
        mock_cursor.fetchall.return_value = mock_results

        connector = NeonConnect.__new__(NeonConnect)
        # Set up the cursor that the search function expects
        connector.cr = mock_cursor

        result = connector.search_data_by_name("plastic")

        # Verify search was performed
        mock_cursor.execute.assert_called_once()
        assert len(result) == 2
        assert result == mock_results

    @patch('psycopg2.connect')
    def test_search_data_by_name_no_results(self, mock_connect):
        """Test data search with no results."""
        mock_connection = Mock()
        mock_cursor = Mock()
        mock_connection.cursor.return_value = mock_cursor
        mock_connect.return_value = mock_connection

        # Mock empty search results
        mock_cursor.fetchall.return_value = []

        connector = NeonConnect.__new__(NeonConnect)
        # Set up the cursor that the search function expects
        connector.cr = mock_cursor

        result = connector.search_data_by_name("nonexistent")

        assert result == []

    @patch('psycopg2.connect')
    def test_get_all_data_success(self, mock_connect):
        """Test successful retrieval of all data."""
        mock_connection = Mock()
        mock_cursor = Mock()
        mock_connection.cursor.return_value = mock_cursor
        mock_connect.return_value = mock_connection

        # Mock all data results
        mock_results = [
            ("bottle", "recycling", "DIY", "content1"),
            ("can", "recycling", "Industrial", "content2"),
            ("paper", "recycling", "DIY", "content3")
        ]
        mock_cursor.fetchall.return_value = mock_results

        connector = NeonConnect.__new__(NeonConnect)

        with patch.object(connector, 'connect', return_value=mock_connection):
            result = connector.get_all_data(mock_cursor)

            assert len(result) == 3
            mock_cursor.execute.assert_called()

    @patch('psycopg2.connect')
    def test_fetch_all_materials_success(self, mock_connect):
        """Test successful retrieval of all materials."""
        mock_connection = Mock()
        mock_cursor = Mock()
        mock_connection.cursor.return_value = mock_cursor
        mock_connect.return_value = mock_connection

        # Mock materials data - note: data is in second column
        mock_results = [
            (1, '{"name": "plastic bottle", "type": "recycling"}'),
            (2, '{"name": "aluminum can", "type": "recycling"}'),
            (3, '{"name": "glass jar", "type": "recycling"}')
        ]
        mock_cursor.fetchall.return_value = mock_results
        
        # Mock cursor.description for column names
        mock_cursor.description = [
            ("id", None), ("data", None)
        ]

        connector = NeonConnect.__new__(NeonConnect)

        with patch.object(connector, 'connect', return_value=mock_connection):
            result = connector.fetch_all_materials()

            assert len(result) == 3
            mock_connection.close.assert_called_once()
            mock_cursor.close.assert_called_once()

    @patch('psycopg2.connect')
    def test_database_error_handling(self, mock_connect):
        """Test handling of database errors."""
        mock_connection = Mock()
        mock_cursor = Mock()
        mock_connection.cursor.return_value = mock_cursor
        mock_connect.return_value = mock_connection

        # Mock database error during execution
        mock_cursor.execute.side_effect = psycopg2.Error("Database error")

        connector = NeonConnect.__new__(NeonConnect)
        test_data = [{"id": "1", "item": "test"}]  # Include required id field

        with patch.object(connector, 'connect', return_value=mock_connection):
            with patch.object(connector, 'create_upsert_query', return_value="INSERT QUERY"):
                # Should raise database error
                with pytest.raises(psycopg2.Error):
                    connector.update_neon_data(test_data)

    def test_class_variables_initialization(self):
        """Test class variables are properly initialized."""
        connector = NeonConnect.__new__(NeonConnect)

        # Test default values
        assert connector.c is None
        assert connector.cr is None

    @patch('psycopg2.connect')
    def test_connection_cleanup(self, mock_connect):
        """Test proper connection cleanup."""
        mock_connection = Mock()
        mock_cursor = Mock()
        mock_connection.cursor.return_value = mock_cursor
        mock_connect.return_value = mock_connection

        connector = NeonConnect.__new__(NeonConnect)

        with patch.object(connector, 'connect', return_value=mock_connection):
            connector.update_neon_data([])

            # update_neon_data doesn't explicitly close connection, only commits
            mock_connection.commit.assert_called_once()

    @patch('psycopg2.connect')
    def test_cursor_operations(self, mock_connect):
        """Test cursor operations and SQL execution."""
        mock_connection = Mock()
        mock_cursor = Mock()
        mock_connection.cursor.return_value = mock_cursor
        mock_connect.return_value = mock_connection

        connector = NeonConnect.__new__(NeonConnect)
        test_data = [{"id": "1", "item": "test", "type": "recycling"}]

        with patch.object(connector, 'connect', return_value=mock_connection):
            with patch.object(connector, 'create_upsert_query', return_value="INSERT QUERY"):
                connector.update_neon_data(test_data)

                # Verify cursor was used for SQL operations
                assert mock_cursor.execute.called
                mock_connection.commit.assert_called_once()
