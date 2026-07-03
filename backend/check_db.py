import app.db.session
from sqlalchemy import text
import asyncio

async def main():
    app.db.session.init_db()
    async with app.db.session.engine.begin() as conn:
        # Check column names of predictions table
        res = await conn.execute(text("SELECT * FROM predictions LIMIT 1"))
        print('Predictions Columns:', list(res.keys()))
        
        # Check column names of alerts table
        res_alerts = await conn.execute(text("SELECT * FROM alerts LIMIT 1"))
        print('Alerts Columns:', list(res_alerts.keys()))
        
    await app.db.session.engine.dispose()

asyncio.run(main())
