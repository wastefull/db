#!/usr/bin/env python3
"""
Comprehensive test runner for Wastefull middleware.
Runs all unit tests, integration tests, and generates coverage reports.
"""

import subprocess
import sys
import os
import time
from pathlib import Path


def run_command(command, description):
    """Run a command and return success status."""
    print(f"🏃 {description}...")
    start_time = time.time()

    try:
        result = subprocess.run(
            command,
            shell=True,
            check=True,
            capture_output=True,
            text=True
        )
        elapsed = time.time() - start_time
        print(f"✅ {description} completed in {elapsed:.2f}s")
        return True, result.stdout
    except subprocess.CalledProcessError as e:
        elapsed = time.time() - start_time
        print(f"❌ {description} failed in {elapsed:.2f}s")
        print(f"Error: {e.stderr}")
        return False, e.stderr


def check_dependencies():
    """Check if required testing dependencies are installed."""
    print("🔍 Checking testing dependencies...")

    required_packages = [
        'pytest',
        'pytest-cov',
        'pytest-mock',
        'requests-mock'
    ]

    missing_packages = []

    for package in required_packages:
        try:
            subprocess.run([sys.executable, '-c', f'import {package.replace("-", "_")}'],
                           check=True, capture_output=True)
            print(f"✅ {package} is installed")
        except subprocess.CalledProcessError:
            missing_packages.append(package)
            print(f"❌ {package} is missing")

    if missing_packages:
        print(
            f"\\n📦 Installing missing packages: {', '.join(missing_packages)}")
        install_cmd = f"{sys.executable} -m pip install {' '.join(missing_packages)}"
        success, output = run_command(install_cmd, "Installing dependencies")
        return success

    return True


def run_unit_tests():
    """Run unit tests with coverage."""
    print("\\n🧪 Running Unit Tests")
    print("=" * 50)

    # Run unit tests with coverage
    cmd = "pytest tests/unit/ -v --cov=. --cov-report=term-missing --cov-report=html:htmlcov --tb=short"
    success, output = run_command(cmd, "Unit tests")

    if success:
        print("\\n📊 Coverage report generated in htmlcov/")

    return success


def run_integration_tests():
    """Run integration tests."""
    print("\\n🔧 Running Integration Tests")
    print("=" * 50)

    cmd = "pytest tests/integration/ -v -m integration --tb=short"
    success, output = run_command(cmd, "Integration tests")

    return success


def run_performance_tests():
    """Run performance tests."""
    print("\\n⚡ Running Performance Tests")
    print("=" * 50)

    cmd = "pytest tests/integration/ -v -m slow --tb=short"
    success, output = run_command(cmd, "Performance tests")

    return success


def run_all_tests():
    """Run all tests."""
    print("\\n🎯 Running All Tests")
    print("=" * 50)

    cmd = "pytest tests/ -v --cov=. --cov-report=term-missing --cov-report=html:htmlcov --tb=short"
    success, output = run_command(cmd, "All tests")

    return success


def run_linting():
    """Run code linting."""
    print("\\n🔍 Running Code Linting")
    print("=" * 50)

    # Check if flake8 is available
    try:
        subprocess.run([sys.executable, '-c', 'import flake8'],
                       check=True, capture_output=True)
        cmd = "flake8 . --count --select=E9,F63,F7,F82 --show-source --statistics"
        success, output = run_command(cmd, "Code linting")
        return success
    except subprocess.CalledProcessError:
        print("⚠️  flake8 not installed, skipping linting")
        return True


def generate_test_report():
    """Generate a comprehensive test report."""
    print("\\n📋 Generating Test Report")
    print("=" * 50)

    # Generate JUnit XML report
    cmd = "pytest tests/ --junitxml=test-results.xml --cov=. --cov-report=xml:coverage.xml"
    success, output = run_command(cmd, "Test report generation")

    if success:
        print("✅ Test report generated: test-results.xml")
        print("✅ Coverage report generated: coverage.xml")

    return success


def main():
    """Main test runner function."""
    print("🧪 Wastefull Middleware Test Runner")
    print("=" * 60)
    print(f"📁 Working directory: {os.getcwd()}")
    print(f"🐍 Python version: {sys.version}")
    print("=" * 60)

    # Change to the connectors directory
    os.chdir('/Users/natto/wastefull-development/wastefull-db/connectors')

    # Track test results
    results = []

    # Check dependencies first
    if not check_dependencies():
        print("❌ Failed to install required dependencies")
        return 1

    # Get command line arguments
    if len(sys.argv) > 1:
        test_type = sys.argv[1].lower()

        if test_type == "unit":
            success = run_unit_tests()
            results.append(("Unit Tests", success))

        elif test_type == "integration":
            success = run_integration_tests()
            results.append(("Integration Tests", success))

        elif test_type == "performance" or test_type == "perf":
            success = run_performance_tests()
            results.append(("Performance Tests", success))

        elif test_type == "lint":
            success = run_linting()
            results.append(("Linting", success))

        elif test_type == "report":
            success = generate_test_report()
            results.append(("Test Report", success))

        elif test_type == "all":
            # Run everything
            success1 = run_linting()
            success2 = run_unit_tests()
            success3 = run_integration_tests()
            success4 = generate_test_report()

            results.extend([
                ("Linting", success1),
                ("Unit Tests", success2),
                ("Integration Tests", success3),
                ("Test Report", success4)
            ])

        else:
            print(f"❌ Unknown test type: {test_type}")
            print("Available options: unit, integration, performance, lint, report, all")
            return 1

    else:
        # Default: run unit tests
        success = run_unit_tests()
        results.append(("Unit Tests", success))

    # Print summary
    print("\\n" + "=" * 60)
    print("🏁 TEST SUMMARY")
    print("=" * 60)

    total_tests = len(results)
    passed_tests = sum(1 for _, success in results if success)

    for test_name, success in results:
        status = "✅ PASSED" if success else "❌ FAILED"
        print(f"{test_name:<20} {status}")

    print("-" * 60)
    print(f"Total: {passed_tests}/{total_tests} test suites passed")

    if passed_tests == total_tests:
        print("🎉 All tests passed!")
        return 0
    else:
        print("💥 Some tests failed!")
        return 1


if __name__ == '__main__':
    exit(main())
