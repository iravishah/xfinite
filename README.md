# express-api

API's to create and list users.

## Quick start

### Step 1: Prerequisite
+ Install Node.js - v8.0 or >=
+ Install MongoDB - v3.6 or >=

### Step 2: Create DB user for MongoDB
```sh
> use expressapi
switched to db expressapi
> db.createUser({user: "admin", pwd: "root", roles: ["readWrite", "dbAdmin"]})
Successfully added user: { "user" : "admin", "roles" : [ "readWrite", "dbAdmin" ] }
```

### Step 3: Restore prerequisite dump

Dump is commited inside the repo

```sh
> mongorestore --db expressapi <location_to_dump>
```

### Step 4: Admin key to access resources
```sh
admin_key: test
```

### Step 5: Install the dependencies
```sh
npm install
```
### Step 6: Run
```sh
npm run start
```
