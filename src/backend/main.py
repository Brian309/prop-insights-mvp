from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
import random  # <--- Nuevo: Para simular fluctuaciones en tiempo real

# Configuración de Base de Datos
DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Property(Base):
    __tablename__ = "properties"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    status = Column(String)
    latency_ms = Column(Integer)

app = FastAPI(title="PropInsights API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/properties")
def read_properties():
    db = SessionLocal()
    try:
        properties = db.query(Property).all()
        
        # TRUCO PRO: Simulamos fluctuaciones en tiempo real para la demo
        results = []
        for p in properties:
            # Variamos la latencia un +/- 15% para que parezca vivo
            fluctuation = random.randint(-15, 50) 
            current_latency = max(10, p.latency_ms + fluctuation)
            
            # Lógica de negocio dinámica: Si latencia > 800, es crítico
            current_status = p.status
            if current_latency > 800:
                current_status = "critical"
            elif current_latency > 300:
                current_status = "warning"
            else:
                current_status = "healthy"

            results.append({
                "id": p.id,
                "name": p.name,
                "status": current_status,
                "latency_ms": current_latency
            })
            
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "System Operational", "version": "MVP-1.0"}