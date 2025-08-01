#!/usr/bin/env python3
"""
Test script for the middleware API endpoints.
"""

import sys
import os
import json
from airtable import AirtableConnector
from neon import NeonConnect


def test_airtable_connection():
    """Test connection to Airtable."""
    print("Testing Airtable connection...")
    try:
        connector = AirtableConnector()
        data = connector.get_all_data()
        print(f"✅ Airtable: Connected successfully, found {len(data)} records")
        return True
    except Exception as e:
        print(f"❌ Airtable: Connection failed - {e}")
        return False


def test_postgres_connection():
    """Test connection to Postgres."""
    print("Testing Postgres connection...")
    try:
        connector = NeonConnect()
        # Test with a simple connection (the __init__ already tests the connection)
        print(f"✅ Postgres: Connected successfully")
        return True
    except Exception as e:
        print(f"❌ Postgres: Connection failed - {e}")
        return False


def test_environment_variables():
    """Test that required environment variables are set."""
    print("Testing environment variables...")

    required_vars = [
        'AIRTABLE_API_KEY',
        'AIRTABLE_BASE_ID',
        'AIRTABLE_TABLE',
        'POSTGRES_URI'
    ]

    missing_vars = []
    for var in required_vars:
        if not os.getenv(var):
            missing_vars.append(var)

    if missing_vars:
        print(f"❌ Missing environment variables: {', '.join(missing_vars)}")
        print("   Create a .env file or set these in your environment")
        return False
    else:
        print("✅ All required environment variables are set")
        return True


def main():
    """Run all tests."""
    print("🧪 Testing Wastefull Middleware Components")
    print("=" * 50)

    tests = [
        test_environment_variables,
        test_airtable_connection,
        test_postgres_connection
    ]

    results = []
    for test in tests:
        try:
            result = test()
            results.append(result)
        except Exception as e:
            print(f"❌ Test failed with exception: {e}")
            results.append(False)
        print()

    # Summary
    passed = sum(results)
    total = len(results)

    print("=" * 50)
    print(f"Test Results: {passed}/{total} passed")

    if passed == total:
        print("✅ All tests passed! Middleware is ready.")
        return 0
    else:
        print("❌ Some tests failed. Check configuration and try again.")
        return 1


if __name__ == '__main__':
    exit(main())
