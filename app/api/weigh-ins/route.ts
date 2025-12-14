import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data.json');

// --- Helper Functions ---

const readData = () => {
  try {
    const jsonData = fs.readFileSync(dataFilePath, 'utf-8');
    return JSON.parse(jsonData);
  } catch (error) {
    return { weighIns: [] };
  }
};

const writeData = (data: any) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

const calculateTotals = (batches: { numFrangos: number; pesoTotalLote: number }[]) => {
  const numSacos = batches.length;
  const numFrangosPesados = batches.reduce((sum, b) => sum + b.numFrangos, 0);
  const pesoTotalFrangos = batches.reduce((sum, b) => sum + b.pesoTotalLote, 0);
  
  // Nova fórmula com o desconto
  const pesoAjustado = pesoTotalFrangos - (numSacos * 0.3);
  const pesoMedio = numFrangosPesados > 0 ? pesoAjustado / numFrangosPesados : 0;

  return { numSacos, numFrangosPesados, pesoTotalFrangos, pesoMedio };
};

// --- API Endpoints ---

export async function GET() {
  const data = readData();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const { galpao, batches } = await request.json();

  if (!galpao || !batches || !Array.isArray(batches) || batches.length === 0) {
    return NextResponse.json({ message: 'Dados inválidos. Galpão e uma lista de sacos são obrigatórios.' }, { status: 400 });
  }

  const totals = calculateTotals(batches);
  const data = readData();

  const newWeighIn = {
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    galpao,
    batches,
    ...totals,
  };

  data.weighIns.push(newWeighIn);
  writeData(data);

  return NextResponse.json(newWeighIn, { status: 201 });
}

export async function PUT(request: Request) {
  const { id, galpao, batches } = await request.json();

  if (!id || !galpao || !batches || !Array.isArray(batches) || batches.length === 0) {
    return NextResponse.json({ message: 'Dados inválidos. ID, galpão e uma lista de sacos são obrigatórios.' }, { status: 400 });
  }

  const data = readData();
  const index = data.weighIns.findIndex((entry: any) => entry.id === id);

  if (index === -1) {
    return NextResponse.json({ message: 'Registro não encontrado.' }, { status: 404 });
  }

  const totals = calculateTotals(batches);
  
  // Atualiza o registro mantendo o ID e a data de criação originais
  data.weighIns[index] = {
    ...data.weighIns[index], // Preserva id, createdAt
    galpao,
    batches,
    ...totals,
  };
  
  writeData(data);

  return NextResponse.json(data.weighIns[index]);
}

export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');

  if (!id) {
    return NextResponse.json({ message: 'ID do registro é obrigatório.' }, { status: 400 });
  }

  const data = readData();
  const initialLength = data.weighIns.length;
  
  data.weighIns = data.weighIns.filter((entry: any) => entry.id !== id);

  if (data.weighIns.length === initialLength) {
    return NextResponse.json({ message: 'Registro não encontrado.' }, { status: 404 });
  }
  
  writeData(data);

  return NextResponse.json({ message: 'Registro apagado com sucesso.' });
}
