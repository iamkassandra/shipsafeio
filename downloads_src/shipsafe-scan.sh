#!/bin/bash
# ShipSafe AI - Local Guardrail Agent Scanner Bootstrapper

# Set text colors
COLOR_BLUE='\033[0;34m'
COLOR_GREEN='\033[0;32m'
COLOR_CYAN='\033[0;36m'
COLOR_RED='\033[0;31m'
COLOR_YELLOW='\033[0;33m'
COLOR_RESET='\033[0m'

echo -e "${COLOR_CYAN}"
echo "  ____  _     _       ____             __       "
echo " / ___|| |__ (_)_ __ / ___|  __ _ / _| ___  "
echo " \___ \| '_ \| | '_ \\___ \ / _\` | |_ / _ \ "
echo "  ___) | | | | | |_) |___) | (_| |  _|  __/ "
echo " |____/|_| |_|_| .__/|____/ \__,_|_|  \___| "
echo "               |_|                          "
echo -e "${COLOR_RESET}"
echo -e "${COLOR_BLUE}Initializing ShipSafe local scanning guardrail...${COLOR_RESET}"

# Check if node is installed
if ! command -v node &> /dev/null
then
    echo -e "${COLOR_RED}Error: node.js is required to run this scanner.${COLOR_RESET}"
    echo -e "${COLOR_YELLOW}Please install Node.js (https://nodejs.org) and try again.${COLOR_RESET}"
    exit 1
fi

# Run the javascript scan script
node "$(dirname "$0")/shipsafe-scan.js"
