#!/bin/bash

# Configuration
REPORT_FOLDER="reports"
ENVIRONMENT="dev"  # Hoặc "dev" tùy thuộc vào môi trường bạn muốn chạy

# Run Artillery Benchmark
artillery run --output $REPORT_FOLDER/results.json -e $ENVIRONMENT $ENVIRONMENT/benchmark-scenario.yaml

# Generate HTML Report
artillery report --output $REPORT_FOLDER/report.html $REPORT_FOLDER/results.json

echo "Benchmark completed. Report generated: $REPORT_FOLDER/report.html"
