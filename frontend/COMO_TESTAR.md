# Como Testar a Nova Interface

## 🚀 Iniciar o Frontend

```bash
cd frontend
npm run dev
```

Acesse: **http://localhost:3001**

## ✅ O que Você Verá

### 1. Background Dinâmico
- Gradiente animado que muda conforme o clima
- Transições suaves entre temas

### 2. Header
- Localização: São Paulo
- Hora atual atualizada em tempo real

### 3. Hero Section (Destaque)
- Temperatura GRANDE no centro
- Ícone animado do clima
- Condição climática
- Sensação térmica

### 4. Weather Cards
- 4 cards com efeito glassmorphism
- Umidade, Luminosidade, Chuva, Status do Sensor
- Hover effect ao passar o mouse

### 5. Gráfico
- Histórico de temperatura e umidade
- Últimas 20 leituras
- Cores dinâmicas por tema

### 6. Previsão
- Scroll horizontal com 7 dias
- Temperatura máx/mín
- Ícones climáticos

## 🎨 Temas Automáticos

A interface muda automaticamente baseado em:

- **Noite** (20h-6h): Tema escuro azul profundo
- **Umidade > 80%**: Tema chuvoso
- **Umidade > 60%**: Tema nublado
- **Umidade < 60%**: Tema ensolarado

## 🔄 Atualização Automática

- Dados atualizados a cada 30 segundos
- Animações suaves nas transições

## 📱 Teste Responsivo

Redimensione a janela para ver:
- Layout adaptativo
- Cards reorganizados
- Scroll horizontal na previsão

## 🐛 Troubleshooting

### Erro de compilação
```bash
# Limpar cache e reinstalar
rm -rf .next node_modules
npm install
npm run dev
```

### Dados não aparecem
1. Verifique se o backend está rodando (porta 21165)
2. Verifique se há dados no InfluxDB
3. Execute: `.\verify-data.ps1` na raiz do projeto

### Tema não muda
- Aguarde 30 segundos para atualização dos dados
- Verifique se há leituras recentes no banco

## 🎯 Próximos Passos

Após testar, informe se:
- ✅ Visual está conforme esperado
- ✅ Animações estão suaves
- ✅ Responsividade funciona
- ✅ Dados carregam corretamente

Então podemos avançar para a **ETAPA 2**!
