#!/bin/bash
cd /home/kavia/workspace/code-generation/document-analysis-and-entity-mapping-platform-176422-176431/frontend_app
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

