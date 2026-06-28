-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

----------------------------------------------------
-- USER PROFILES
----------------------------------------------------
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

    full_name TEXT NOT NULL,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'staff'
        CHECK (role IN ('admin','staff','driver')),

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

----------------------------------------------------
-- ORDERS
----------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
    id BIGSERIAL PRIMARY KEY,

    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_address TEXT,

    order_type TEXT NOT NULL,
    cylinder_size TEXT NOT NULL,

    quantity INTEGER NOT NULL DEFAULT 1,

    amount DECIMAL(10,2) NOT NULL,

    status TEXT DEFAULT 'Pending'
        CHECK (status IN ('Pending','Assigned','Out for Delivery','Delivered','Cancelled')),

    assigned_driver UUID REFERENCES profiles(id),

    payment_method TEXT,
    payment_status TEXT DEFAULT 'Unpaid',

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

----------------------------------------------------
-- DELIVERIES
----------------------------------------------------
CREATE TABLE IF NOT EXISTS deliveries (
    id BIGSERIAL PRIMARY KEY,

    order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,

    driver_id UUID REFERENCES profiles(id),

    delivery_status TEXT DEFAULT 'Pending',

    notes TEXT,

    delivered_at TIMESTAMP WITH TIME ZONE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

----------------------------------------------------
-- STOCK
----------------------------------------------------
CREATE TABLE IF NOT EXISTS stock (

    id BIGSERIAL PRIMARY KEY,

    cylinder_size TEXT NOT NULL,

    full_cylinders INTEGER DEFAULT 0,

    empty_cylinders INTEGER DEFAULT 0,

    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

----------------------------------------------------
-- PRICE LIST
----------------------------------------------------
CREATE TABLE IF NOT EXISTS prices (

    id BIGSERIAL PRIMARY KEY,

    order_type TEXT NOT NULL,

    cylinder_size TEXT NOT NULL,

    price DECIMAL(10,2) NOT NULL
);
