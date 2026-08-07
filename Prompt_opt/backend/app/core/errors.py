"""Domain errors raised by the AI engine and mapped to HTTP status codes."""


class AIEngineError(Exception):
    """Base class for every failure originating in the AI engine."""


class InferenceError(AIEngineError):
    """The language model could not be reached or returned no usable output."""


class InvalidVerdictError(AIEngineError):
    """The judge replied, but not with a score and feedback we can trust."""
