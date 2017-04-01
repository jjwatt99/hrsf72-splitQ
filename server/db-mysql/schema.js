module.exports = {
  members: 'CREATE TABLE IF NOT EXISTS members (\
      id            int NOT NULL AUTO_INCREMENT,\
      fb_id          varchar(100) NOT NULL DEFAULT \'Payee\',\
      name          varchar(50) NOT NULL,\
      email          varchar(50) NOT NULL DEFAULT \'Payee\',\
      token          varchar(360) NOT NULL DEFAULT \'Payee\',\
      picture        varchar(360) NOT NULL DEFAULT \'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Pomeranian.JPG/200px-Pomeranian.JPG\',\
      PRIMARY KEY   (ID)\
    )',
  trips: 'CREATE TABLE IF NOT EXISTS trips (\
      id            int NOT NULL AUTO_INCREMENT,\
      name          varchar(50) NOT NULL,\
      adminID       int NOT NULL,\
      PRIMARY KEY   (ID)\
    )',
  tripsMem: 'CREATE TABLE IF NOT EXISTS trips_members (\
      tripID      int NOT NULL,\
      memberID    int NOT NULL\
    )',
  admin: 'ALTER TABLE trips ADD FOREIGN KEY (adminID)\
    REFERENCES members(id)',
  tid: 'ALTER TABLE trips_members ADD FOREIGN KEY (tripID)\
    REFERENCES trips(id)',
  memId: 'ALTER TABLE trips_members ADD FOREIGN KEY (memberID)\
    REFERENCES members(id)',
  receipts: 'CREATE TABLE IF NOT EXISTS receipts (\
      id            int NOT NULL AUTO_INCREMENT,\
      payorID      int NOT NULL,\
      tripID       int NOT NULL,\
      name          varchar(50) NOT NULL,\
      url           varchar(100),\
      sum_bill    int NOT NULL DEFAULT 0,\
      sum_tax     int NOT NULL DEFAULT 0,\
      sum_tip     int NOT NULL DEFAULT 0,\
      PRIMARY KEY   (ID)\
    )',
  payor: 'ALTER TABLE receipts ADD FOREIGN KEY (payorID)\
    REFERENCES members(id)',
  rtid: 'ALTER TABLE receipts ADD FOREIGN KEY (tripID)\
    REFERENCES trips(id)',
  items: 'CREATE TABLE IF NOT EXISTS items (\
      id            int NOT NULL AUTO_INCREMENT,\
      receiptID     int NOT NULL,\
      tripID        int NOT NULL,\
      name          varchar(50) NOT NULL,\
      raw_price     int NOT NULL DEFAULT 0,\
      comment      varchar(50),\
      PRIMARY KEY   (ID)\
    )',
  irec: 'ALTER TABLE items ADD FOREIGN KEY (receiptID)\
    REFERENCES receipts(id)',
  consumed: 'CREATE TABLE IF NOT EXISTS consumed_items (\
      itemID       int NOT NULL,\
      payorID      int NOT NULL,\
      payeeID      int NOT NULL,\
      receiptID    int NOT NULL,\
      tripID       int NOT NULL,\
      payment       varchar(10) NOT NULL DEFAULT \'unpaid\'\
    )',
  cid: 'ALTER TABLE consumed_items ADD FOREIGN KEY (itemID)\
    REFERENCES items(id)',
  cpayor: 'ALTER TABLE consumed_items ADD FOREIGN KEY (payorID)\
    REFERENCES members(id)',
  payee: 'ALTER TABLE consumed_items ADD FOREIGN KEY (payeeID)\
    REFERENCES members(id)',
  crec: 'ALTER TABLE consumed_items ADD FOREIGN KEY (receiptID)\
    REFERENCES receipts(id)',
  ctrip: 'ALTER TABLE consumed_items ADD FOREIGN KEY (tripID)\
    REFERENCES trips(id)'
};

// select members.name from members, trips where trips.id = 1;

