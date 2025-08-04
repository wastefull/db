"""
Pytest configuration and shared fixtures for middleware tests.
"""

import pytest
import os
import sys
from unittest.mock import Mock, patch

# Add the parent directory to the path so we can import our modules
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

@pytest.fixture
def mock_env_vars():
    """Mock environment variables for testing."""
    with patch.dict(os.environ, {
        'AIRTABLE_API_KEY': 'test_key_123',
        'AIRTABLE_BASE_ID': 'test_base_456',
        'AIRTABLE_TABLE': 'test_table',
        'POSTGRES_URI': 'postgresql://test:test@localhost:5432/test',
        'UNSPLASH_AK': 'test_unsplash_key',
        'UNSPLASH_SK': 'test_unsplash_secret'
    }):
        yield

@pytest.fixture
def sample_airtable_data():
    """Sample Airtable data for testing."""
    return [
        {
            'id': 'rec123',
            'fields': {
                'Item': 'plastic bottle',
                'Type': 'recycling',
                'Method': 'DIY',
                'Title': 'How to Recycle Plastic Bottles',
                'Content': 'Test content...',
                'Sources': ['recSRC123']
            }
        },
        {
            'id': 'rec456',
            'fields': {
                'Item': 'aluminum can',
                'Type': 'recycling',
                'Method': 'Industrial',
                'Title': 'Industrial Aluminum Recycling',
                'Content': 'Test content...',
                'Sources': ['recSRC456']
            }
        }
    ]

@pytest.fixture
def sample_postgres_data():
    """Sample PostgreSQL data for testing."""
    return [
        {
            'id': 1,
            'item': 'plastic bottle',
            'type': 'recycling',
            'method': 'DIY',
            'created_at': '2025-08-04T10:00:00Z'
        },
        {
            'id': 2,
            'item': 'aluminum can',
            'type': 'recycling',
            'method': 'Industrial',
            'created_at': '2025-08-04T10:30:00Z'
        }
    ]

@pytest.fixture
def mock_requests():
    """Mock requests library for API testing."""
    with patch('requests.get') as mock_get, \
         patch('requests.post') as mock_post:
        yield {'get': mock_get, 'post': mock_post}
