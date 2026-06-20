import app.db.session
from sqlalchemy import text
import asyncio

async def main():
    app.db.session.init_db()
    async with app.db.session.engine.begin() as conn:
        res = await conn.execute(text("SELECT COUNT(*), COUNT(shap_json) FROM predictions"))
        print('Predictions Stats:', res.first())
    await app.db.session.engine.dispose()

asyncio.run(main())
