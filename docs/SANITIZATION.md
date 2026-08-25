# Public baseline sanitation record

This repository is a new public working copy. The original academic/client delivery remains private and is not connected to this Git repository or its remote.

Before Git initialization, the public baseline removed legacy source files containing credentials and client-specific operational documentation. Legacy binary assets are excluded from version control and replaced by a neutral DMS mark. The committed source must contain only fictional, generic portfolio content.

## Required checks before every public commit

1. Run a secret scan and review every match manually.
2. Confirm `git status --ignored` does not reveal files intended for publication by mistake.
3. Confirm no patient data, contact details, client identity, clinical imagery, or imported documents are staged.
4. Do not add an environment file other than `.env.example`.

The external credentials found in the source project must be revoked at their provider; excluding them from Git does not revoke them.
