#!/usr/bin/env python3
"""
Setup and run comprehensive unit tests for the Wastefull middleware.
This script sets up pytest infrastructure and runs all middleware tests.
"""

import subprocess
import sys
import os


def install_testing_dependencies():
    """Install required testing packages."""
    packages = [
        'pytest',
        'pytest-cov',
        'pytest-mock',
        'requests-mock',
        'python-dotenv'
    ]

    print("📦 Installing testing dependencies...")
    for package in packages:
        try:
            subprocess.run([sys.executable, '-m', 'pip', 'install', package],
                           check=True, capture_output=True)
            print(f"✅ Installed {package}")
        except subprocess.CalledProcessError:
            print(f"❌ Failed to install {package}")
            return False
    return True


def create_pytest_config():
    """Create pytest configuration file."""
    config_content = """[tool:pytest]
testpaths = tests
python_files = test_*.py
python_classes = Test*
python_functions = test_*
addopts = 
    --cov=.
    --cov-report=html
    --cov-report=term-missing
    --verbose
    --tb=short
markers =
    unit: Unit tests
    integration: Integration tests
    slow: Slow tests
"""

    with open('pytest.ini', 'w') as f:
        f.write(config_content)
    print("✅ Created pytest.ini configuration")


def setup_test_directory():
    """Create test directory structure."""
    os.makedirs('tests', exist_ok=True)
    os.makedirs('tests/unit', exist_ok=True)
    os.makedirs('tests/integration', exist_ok=True)

    # Create __init__.py files
    for path in ['tests', 'tests/unit', 'tests/integration']:
        init_file = os.path.join(path, '__init__.py')
        if not os.path.exists(init_file):
            with open(init_file, 'w') as f:
                f.write('# Test package\n')

    print("✅ Created test directory structure")


def create_conftest():
    """Create pytest configuration and fixtures."""
    conftest_content = '''"""
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
    with patch('requests.get') as mock_get, \\
         patch('requests.post') as mock_post:
        yield {'get': mock_get, 'post': mock_post}
'''

    with open('tests/conftest.py', 'w') as f:
        f.write(conftest_content)
    print("✅ Created conftest.py with shared fixtures")


def main():
    """Set up testing infrastructure."""
    print("🧪 Setting up Wastefull Middleware Testing Infrastructure")
    print("=" * 60)

    # Change to the connectors directory
    os.chdir('/Users/natto/wastefull-development/wastefull-db/connectors')

    # Install dependencies
    if not install_testing_dependencies():
        print("❌ Failed to install testing dependencies")
        return 1

    # Create configuration and directories
    create_pytest_config()
    setup_test_directory()
    create_conftest()

    print("\n✅ Testing infrastructure setup complete!")
    print("\nNext steps:")
    print("1. Run: python3 test_setup.py")
    print("2. Individual test files will be created for each module")
    print("3. Run tests with: pytest")
    print("4. Run with coverage: pytest --cov")

    return 0


if __name__ == '__main__':
    exit(main())
