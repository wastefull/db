from typing import Optional
import os


def gl(l, n):
    """
    Get a line from a list of lines.
    :param l: A list of lines.
    :param n: The line number to retrieve.
    :return: The line at the specified index.
    """
    if n < 0 or n >= len(l):
        raise IndexError("Line number out of range.")
    return l[n].strip()


def gf(f, d):
    """
    Get a field from a dictionary.
    :param f: The field to retrieve.
    :param d: The dictionary to retrieve the field from.
    :return: The value of the field in the dictionary.
    """
    return d.get(f, None)


def any_missing(required, provided):
    """
    Check if any required keys are missing in the provided dictionary.
    :param required: A list of required keys.
    :param provided: A dictionary to check against.
    :return: True if any required keys are missing, False otherwise.
    """
    result = not all(key in provided for key in required)
    if result:
        print("Missing required keys in the provided dictionary:")
        for key in required:
            if key not in provided:
                print(f"Missing key: {key}")
    return result


def get_secret(name: str, fallback_line: Optional[int] = None, file_path: str = "../private.txt"):
    """
    Try to get a secret from the environment, otherwise from a line in private.txt.
    :param name: The environment variable name.
    :param fallback_line: The line number (0-based) in private.txt to use if env var is not set.
    :param file_path: Path to private.txt.
    :return: The secret value as a string.
    """
    value = os.environ.get(name)
    if value:
        return value
    if fallback_line is not None:
        try:
            with open(file_path) as f:
                lines = [line.strip() for line in f.readlines()]
                return lines[fallback_line]
        except Exception as e:
            raise RuntimeError(
                f"Could not read {name} from env or {file_path}: {e}")
    raise RuntimeError(f"Secret {name} not found in env or {file_path}")
