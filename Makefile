# UIMatch Visual Verification - Generic Makefile
# Works with any Figma-to-React project

.PHONY: help verify verify-list verify-sections verify-section screenshot install-uimatch clean

# Configuration (MUST be provided or set via environment)
CONFIG ?= uimatch-config.json

# Default URL (can be overridden)
URL ?= http://localhost:5173

# Default profile (can be overridden)
PROFILE ?= component/dev

help:
	@echo ""
	@echo "╔══════════════════════════════════════════════════════════════╗"
	@echo "║            Figma Visual Verification Tools                   ║"
	@echo "╠══════════════════════════════════════════════════════════════╣"
	@echo "║  make verify NODE=x CONFIG=path  - UIMatch single node       ║"
	@echo "║  make verify-list CONFIG=path    - List UIMatch nodes        ║"
	@echo "║  make verify-sections            - Compare all sections      ║"
	@echo "║  make verify-section SECTION=x   - Compare single section    ║"
	@echo "║  make screenshot                 - Take screenshot           ║"
	@echo "║  make install-uimatch            - Install dependencies      ║"
	@echo "║  make clean                      - Clean temporary files     ║"
	@echo "╚══════════════════════════════════════════════════════════════╝"
	@echo ""
	@echo "UIMatch (single node comparison):"
	@echo "  make verify-list CONFIG=scripts_gadki/uimatch-config.json"
	@echo "  make verify NODE=hero CONFIG=scripts_gadki/uimatch-config.json"
	@echo ""
	@echo "Sections (full page → crop → compare):"
	@echo "  make verify-sections SECTIONS_CONFIG=scripts_gadki/sections-config.json"
	@echo "  make verify-section SECTION=hero SECTIONS_CONFIG=scripts_gadki/sections-config.json"
	@echo ""

# List all available nodes from config
verify-list:
	@if [ ! -f "$(CONFIG)" ]; then \
		echo "❌ Config file not found: $(CONFIG)"; \
		echo "   Usage: make verify-list CONFIG=path/to/config.json"; \
		exit 1; \
	fi
	@node scripts/verify-uimatch.cjs --config=$(CONFIG) --list

# Generic verify - requires NODE and CONFIG parameters
verify:
ifndef NODE
	@echo "❌ NODE is required!"
	@echo "   Usage: make verify NODE=hero CONFIG=path/to/config.json"
	@echo ""
	@echo "   Run 'make verify-list CONFIG=...' to see available nodes"
	@exit 1
endif
	@if [ ! -f "$(CONFIG)" ]; then \
		echo "❌ Config file not found: $(CONFIG)"; \
		echo "   Usage: make verify NODE=$(NODE) CONFIG=path/to/config.json"; \
		exit 1; \
	fi
	@node scripts/verify-uimatch.cjs --config=$(CONFIG) $(NODE) --url=$(URL) --profile=$(PROFILE)

# Verify all sections (Figma → crop → compare with implementation)
# Requires SECTIONS_CONFIG parameter
SECTIONS_CONFIG ?= sections-config.json

verify-sections:
	@if [ ! -f "$(SECTIONS_CONFIG)" ]; then \
		echo "❌ Sections config not found: $(SECTIONS_CONFIG)"; \
		echo "   Usage: make verify-sections SECTIONS_CONFIG=path/to/sections-config.json"; \
		exit 1; \
	fi
	@node scripts/verify-figma-sections.cjs --config=$(SECTIONS_CONFIG) --url=$(URL)

# Verify single section
verify-section:
ifndef SECTION
	@echo "❌ SECTION is required!"
	@echo "   Usage: make verify-section SECTION=hero SECTIONS_CONFIG=path/to/config.json"
	@exit 1
endif
	@if [ ! -f "$(SECTIONS_CONFIG)" ]; then \
		echo "❌ Sections config not found: $(SECTIONS_CONFIG)"; \
		exit 1; \
	fi
	@node scripts/verify-figma-sections.cjs --config=$(SECTIONS_CONFIG) --url=$(URL) --section=$(SECTION)

# Take screenshot of current page
screenshot:
	@echo "📸 Taking screenshot..."
	@mkdir -p tmp
	@npx playwright screenshot $(URL) tmp/screenshot-$$(date +%Y%m%d-%H%M%S).png --viewport-size=1920,1080
	@echo "✅ Screenshot saved to tmp/"

# Install UIMatch and Playwright
install-uimatch:
	@echo "📦 Installing UIMatch and Playwright..."
	npm install -D @uimatch/cli playwright
	npx playwright install chromium
	@echo "✅ UIMatch installed!"

# Clean temporary files
clean:
	@echo "🧹 Cleaning temporary files..."
	rm -rf tmp/uimatch-reports/*
	rm -f tmp/screenshot-*.png
	@echo "✅ Cleaned!"
