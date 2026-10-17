import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

load_dotenv()

# 1. Check Full URLs
DATABASE_URL = (
    os.getenv("DATABASE_URL")
    or os.getenv("MYSQL_URL")
    or os.getenv("MYSQL_PRIVATE_URL")
    or os.getenv("MYSQL_PUBLIC_URL")
)

# 2. Agar Full URL na mile toh individual variables se URL banayein
if not DATABASE_URL and os.getenv("MYSQLHOST"):
    user = os.getenv("MYSQLUSER", "root")
    password = os.getenv("MYSQLPASSWORD", "")
    host = os.getenv("MYSQLHOST", "localhost")
    port = os.getenv("MYSQLPORT", "3306")
    database = os.getenv("MYSQLDATABASE", "railway")
    DATABASE_URL = f"mysql+pymysql://{user}:{password}@{host}:{port}/{database}"

# 3. Agar kuch bhi na mile tabhi error de
if not DATABASE_URL:
    raise ValueError("ERROR: DATABASE_URL Environment Variable not found!")

# Convert postgres:// or mysql:// prefixes for SQLAlchemy
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
elif DATABASE_URL.startswith("mysql://"):
    DATABASE_URL = DATABASE_URL.replace("mysql://", "mysql+pymysql://", 1)

print(f"Connecting to database at: {DATABASE_URL.split('@')[-1] if '@' in DATABASE_URL else 'local'}")


# Configure SSL for TiDB Cloud Serverless
connect_args = {}
if "tidbcloud.com" in DATABASE_URL:
    try:
        import certifi
        connect_args = {
            "ssl": {
                "ca": certifi.where(),
                "check_hostname": True
            }
        }
    except Exception:
        connect_args = {
            "ssl": {
                "check_hostname": True
            }
        }
engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
    pool_pre_ping=True,
    pool_recycle=300
)
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()