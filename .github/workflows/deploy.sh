ssh root@139.59.238.28 "cd ~/nemo-ai-core && git pull && yarn install && yarn schema:reset && pm2 restart core-api && exit"
