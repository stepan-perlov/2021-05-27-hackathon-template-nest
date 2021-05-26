## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Install node_modules

```bash
$ npm install
```

## Install nodejs

```bash
sudo apt install --yes curl
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt install --yes nodejs
```

## Postgresql

```bash
sudo -u postgres psql -c 'CREATE DATABASE hachathon'
sudo -u postgres psql -d hachathon <<QUERIES
    SELECT now();
QUERIES
```
