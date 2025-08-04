"""
Unit tests for airtable.py module.
"""

import pytest
from unittest.mock import Mock, patch, MagicMock

from airtable import AirtableConnector


class TestAirtableConnector:
    """Test AirtableConnector class."""

    @patch('airtable.Api')
    def test_init_with_env_vars(self, mock_api, mock_env_vars):
        """Test AirtableConnector initialization with environment variables."""
        # Mock the API and table chain
        mock_api_instance = Mock()
        mock_base = Mock()
        mock_table = Mock()

        mock_api.return_value = mock_api_instance
        mock_api_instance.base.return_value = mock_base
        mock_base.table.return_value = mock_table

        connector = AirtableConnector()

        # Verify initialization
        mock_api.assert_called_once_with("test_key_123")
        mock_api_instance.base.assert_called_once_with("test_base_456")
        mock_base.table.assert_called_once_with("test_table")

        assert connector.base_id == "test_base_456"
        assert connector.table_name == "test_table"
        assert connector.table == mock_table

    @patch.dict('os.environ', {}, clear=True)
    @patch('airtable.get_secret')
    def test_init_missing_credentials(self, mock_get_secret):
        """Test initialization when credentials are missing."""
        mock_get_secret.return_value = None

        connector = AirtableConnector()

        # Should not raise error but table should not be set
        assert not hasattr(connector, 'table') or connector.table is None

    def test_get_all_data_approved_only(self, mock_env_vars):
        """Test retrieving approved records only."""
        with patch('airtable.Api') as mock_api:
            # Setup mock chain
            mock_api_instance = Mock()
            mock_base = Mock()
            mock_table = Mock()

            mock_api.return_value = mock_api_instance
            mock_api_instance.base.return_value = mock_base
            mock_base.table.return_value = mock_table

            # Mock table.all() method
            mock_records = [
                {"id": "rec1", "fields": {"Item": "bottle", "Status": "Approved"}},
                {"id": "rec2", "fields": {"Item": "can", "Status": "Approved"}}
            ]
            mock_table.all.return_value = mock_records

            connector = AirtableConnector()
            result = connector.get_all_data(filter_approved_only=True)

            # Verify correct filter was applied
            mock_table.all.assert_called_once_with(
                formula="Status = 'Approved'")
            assert len(result) == 2
            assert result[0]["fields"]["Item"] == "bottle"

    def test_get_all_data_no_filter(self, mock_env_vars):
        """Test retrieving all records without filter."""
        with patch('airtable.Api') as mock_api:
            # Setup mock chain
            mock_api_instance = Mock()
            mock_base = Mock()
            mock_table = Mock()

            mock_api.return_value = mock_api_instance
            mock_api_instance.base.return_value = mock_base
            mock_base.table.return_value = mock_table

            # Mock table.all() method
            mock_records = [
                {"id": "rec1", "fields": {"Item": "bottle", "Status": "Approved"}},
                {"id": "rec2", "fields": {"Item": "can", "Status": "Draft"}}
            ]
            mock_table.all.return_value = mock_records

            connector = AirtableConnector()
            result = connector.get_all_data(filter_approved_only=False)

            # Verify no filter was applied
            mock_table.all.assert_called_once_with()
            assert len(result) == 2

    def test_get_all_data_no_table(self, mock_env_vars):
        """Test handling when table is not initialized."""
        with patch('airtable.Api'):
            connector = AirtableConnector()
            connector.table = None  # Simulate uninitialized table

            with pytest.raises(ValueError, match="Table does not exist or is not initialized"):
                connector.get_all_data()

    def test_get_table(self, mock_env_vars):
        """Test retrieving a specific table."""
        with patch('airtable.Api') as mock_api:
            # Setup mock chain
            mock_api_instance = Mock()
            mock_base = Mock()
            mock_new_table = Mock()

            mock_api.return_value = mock_api_instance
            mock_api_instance.base.return_value = mock_base
            # First for init, second for get_table
            mock_base.table.side_effect = [Mock(), mock_new_table]

            connector = AirtableConnector()
            result = connector.get_table("Sources")

            # Verify correct table was requested
            # Once for init, once for get_table
            assert mock_api_instance.base.call_count == 2
            mock_base.table.assert_called_with("Sources")
            assert result == mock_new_table

    def test_get_table_data_approved_only(self, mock_env_vars):
        """Test retrieving data from specific table with approval filter."""
        with patch('airtable.Api') as mock_api:
            # Setup mock chain
            mock_api_instance = Mock()
            mock_base = Mock()
            mock_init_table = Mock()
            mock_sources_table = Mock()

            mock_api.return_value = mock_api_instance
            mock_api_instance.base.return_value = mock_base
            mock_base.table.side_effect = [mock_init_table, mock_sources_table]

            # Mock sources table data
            mock_sources_data = [
                {"id": "recSRC1", "fields": {"Name": "EPA", "Status": "Approved"}},
                {"id": "recSRC2", "fields": {
                    "Name": "Research Gate", "Status": "Approved"}}
            ]
            mock_sources_table.all.return_value = mock_sources_data

            connector = AirtableConnector()
            result = connector.get_table_data(
                "Sources", filter_approved_only=True)

            # Verify correct filter was applied to sources table
            mock_sources_table.all.assert_called_once_with(
                formula="Status = 'Approved'")
            assert len(result) == 2
            assert result[0]["fields"]["Name"] == "EPA"

    def test_get_table_data_no_filter(self, mock_env_vars):
        """Test retrieving all data from specific table without filter."""
        with patch('airtable.Api') as mock_api:
            # Setup mock chain
            mock_api_instance = Mock()
            mock_base = Mock()
            mock_init_table = Mock()
            mock_sources_table = Mock()

            mock_api.return_value = mock_api_instance
            mock_api_instance.base.return_value = mock_base
            mock_base.table.side_effect = [mock_init_table, mock_sources_table]

            # Mock sources table data
            mock_sources_data = [
                {"id": "recSRC1", "fields": {"Name": "EPA", "Status": "Approved"}},
                {"id": "recSRC2", "fields": {
                    "Name": "Draft Source", "Status": "Draft"}}
            ]
            mock_sources_table.all.return_value = mock_sources_data

            connector = AirtableConnector()
            result = connector.get_table_data(
                "Sources", filter_approved_only=False)

            # Verify no filter was applied
            mock_sources_table.all.assert_called_once_with()
            assert len(result) == 2

    def test_ignore_cache_parameter(self, mock_env_vars):
        """Test ignore_cache parameter functionality."""
        with patch('airtable.Api'):
            connector = AirtableConnector(ignore_cache=True)
            assert connector.ignore_cache is True

            connector2 = AirtableConnector(ignore_cache=False)
            assert connector2.ignore_cache is False

    @patch('airtable.Api')
    def test_api_error_handling(self, mock_api, mock_env_vars):
        """Test handling of API errors."""
        # Setup mock to raise exception
        mock_api_instance = Mock()
        mock_base = Mock()
        mock_table = Mock()

        mock_api.return_value = mock_api_instance
        mock_api_instance.base.return_value = mock_base
        mock_base.table.return_value = mock_table

        # Mock table.all() to raise an exception
        mock_table.all.side_effect = Exception("API Error")

        connector = AirtableConnector()

        with pytest.raises(Exception, match="API Error"):
            connector.get_all_data()

    def test_class_variable_ignore_cache(self):
        """Test class variable ignore_cache."""
        # Test default value
        assert AirtableConnector.ignore_cache is False

        # Test that it can be modified
        AirtableConnector.ignore_cache = True
        assert AirtableConnector.ignore_cache is True

        # Reset to default
        AirtableConnector.ignore_cache = False
