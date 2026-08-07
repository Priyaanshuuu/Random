"""Builds and installs the Groq-backed language model DSPy runs against."""

import threading

import dspy

from app.core.config import (
    DSPY_MODEL,
    GROQ_API_KEY,
    LM_CACHE,
    LM_MAX_TOKENS,
    LM_NUM_RETRIES,
    LM_TEMPERATURE,
)

# This package is itself named `dspy`. If the interpreter picked it up instead of
# the installed library, every attribute below would be missing — fail here with
# an explanation rather than deep inside a module constructor.
if not hasattr(dspy, "LM"):
    raise ImportError(
        "`import dspy` resolved to app/dspy/ instead of the DSPy library. "
        "Run the app from the backend/ directory so it is the sys.path root."
    )

_lock = threading.Lock()
_lm: dspy.LM | None = None
_configured = False


def get_lm() -> dspy.LM:
    """Returns the process-wide Groq LM, building it on first use.

    Modules attach this explicitly via ``set_lm`` rather than relying on
    ``dspy.settings``, whose configuration belongs to the thread that set it —
    FastAPI runs synchronous endpoints on worker threads, so a globally
    configured LM is not reliably visible from inside a request.
    """
    global _lm

    if _lm is None:
        with _lock:
            if _lm is None:
                _lm = dspy.LM(
                    DSPY_MODEL,
                    api_key=GROQ_API_KEY,
                    temperature=LM_TEMPERATURE,
                    max_tokens=LM_MAX_TOKENS,
                    num_retries=LM_NUM_RETRIES,
                    cache=LM_CACHE,
                )

    return _lm


def configure_dspy() -> dspy.LM:
    """Installs the LM as the DSPy default and returns it.

    Called once at application startup. Modules do not depend on this having run
    — it exists so ad-hoc DSPy usage and tooling see the same model.

    `dspy.settings` may only be written by the thread that first wrote it, so
    repeat calls are skipped: starting the app twice in one process (as tests do)
    would otherwise raise from a second, different thread.
    """
    global _configured

    lm = get_lm()

    with _lock:
        if not _configured:
            dspy.configure(lm=lm)
            _configured = True

    return lm
