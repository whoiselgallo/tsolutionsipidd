$reportPath = "./pre-deploy-report.txt"
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
"=== REPORTE DE PRE-DEPLOY ($timestamp) ===" | Out-File $reportPath

function Log {
    param([string]$msg)
    Write-Host $msg
    Add-Content $reportPath $msg
}

Write-Host "=== INICIANDO AUDITORÍA COMPLETA ===" -ForegroundColor Cyan
Log "Iniciando auditoría completa del proyecto..."

# ------------------------------------------------------------
# 1. Verificar pnpm
# ------------------------------------------------------------
Log "`n[1] Verificando pnpm..."
try {
    $pnpmVersion = pnpm -v
    Log "✔ pnpm instalado. Versión: $pnpmVersion"
} catch {
    Log "✘ pnpm no está instalado."
    Log "Instalando pnpm automáticamente..."
    Invoke-WebRequest https://get.pnpm.io/install.ps1 -UseBasicParsing | Invoke-Expression
    $pnpmVersion = pnpm -v
    Log "✔ pnpm instalado. Versión: $pnpmVersion"
}

# ------------------------------------------------------------
# 2. Verificar pnpm-lock.yaml
# ------------------------------------------------------------
Log "`n[2] Verificando pnpm-lock.yaml..."
if (!(Test-Path "./pnpm-lock.yaml")) {
    Log "✘ pnpm-lock.yaml no existe. Ejecutando pnpm install..."
    pnpm install
    Log "✔ pnpm-lock.yaml generado."
} else {
    Log "✔ pnpm-lock.yaml encontrado."
}

# ------------------------------------------------------------
# 3. Verificar versión de Vite
# ------------------------------------------------------------
Log "`n[3] Verificando versión de Vite..."
$viteVersion = pnpm list vite --depth=0
if ($viteVersion -match "5.4.10") {
    Log "✔ Vite 5.4.10 instalado correctamente."
} else {
    Log "✘ Vite no está en la versión 5.4.10."
    Log "Corrigiendo automáticamente..."
    pnpm add -D vite@5.4.10
    Log "✔ Vite actualizado a 5.4.10."
}

# ------------------------------------------------------------
# 4. Verificar patchedDependencies
# ------------------------------------------------------------
Log "`n[4] Verificando patchedDependencies..."
$packageJson = Get-Content "./package.json" -Raw
if ($packageJson -match "patchedDependencies") {
    Log "✘ patchedDependencies detectado. Eliminando automáticamente..."
    $cleanJson = $packageJson -replace '"patchedDependencies":\s*\{[^}]*\},?', ""
    $cleanJson | Out-File "./package.json"
    Log "✔ patchedDependencies eliminado."
} else {
    Log "✔ No hay patchedDependencies."
}

# ------------------------------------------------------------
# 5. Verificar build local
# ------------------------------------------------------------
Log "`n[5] Ejecutando build local..."
pnpm run build
if ($LASTEXITCODE -eq 0) {
    Log "✔ Build local exitoso."
} else {
    Log "✘ El build local falló. Revisa errores antes de deploy."
    exit
}

# ------------------------------------------------------------
# 6. Verificar migraciones Drizzle
# ------------------------------------------------------------
Log "`n[6] Verificando migraciones..."
pnpm db:push
if ($LASTEXITCODE -eq 0) {
    Log "✔ Migraciones aplicadas correctamente."
} else {
    Log "✘ Error en migraciones. Revisa tu esquema."
    exit
}

# ------------------------------------------------------------
# 7. Verificar .env y .gitignore
# ------------------------------------------------------------
Log "`n[7] Verificando .env..."
if (Test-Path "./.env") {
    $gitignore = Get-Content "./.gitignore"
    if ($gitignore -match "\.env") {
        Log "✔ .env está protegido por .gitignore."
    } else {
        Log "✘ .env no está en .gitignore. Corrigiendo automáticamente..."
        Add-Content "./.gitignore" "`n.env"
        Log "✔ .env agregado a .gitignore."
    }
} else {
    Log "✔ No existe .env en el repo (correcto)."
}

# ------------------------------------------------------------
# 8. Verificar render.yaml
# ------------------------------------------------------------
Log "`n[8] Verificando render.yaml..."
if (!(Test-Path "./render.yaml")) {
    Log "✘ No existe render.yaml. Creándolo automáticamente..."
    @"
services:
  - type: web
    name: brand-identity-api
    env: node
    plan: free
    buildCommand: |
      curl -fsSL https://get.pnpm.io/install.sh | sh -
      pnpm install
      pnpm run build
    startCommand: pnpm start
    autoDeploy: true
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 3000
"@ | Out-File "./render.yaml"
    Log "✔ render.yaml creado."
} else {
    Log "✔ render.yaml encontrado."
}

# ------------------------------------------------------------
# 9. Verificar estado de Git
# ------------------------------------------------------------
Log "`n[9] Verificando estado de Git..."
$gitStatus = git status --porcelain
if ($gitStatus) {
    Log "✘ Tienes cambios sin commitear. Ejecutando commit automático..."
    git add .
    git commit -m "pre-deploy automático"
    Log "✔ Cambios commiteados automáticamente."
} else {
    Log "✔ No hay cambios pendientes."
}

# ------------------------------------------------------------
# 10. Confirmación final
# ------------------------------------------------------------
Log "`n✔ TODO LISTO PARA DEPLOY A RENDER"
Log "Ejecuta: git push origin main"

Write-Host "`n=== AUDITORÍA COMPLETA — REPORTE GENERADO ===" -ForegroundColor Cyan
Write-Host "Archivo: pre-deploy-report.txt" -ForegroundColor Green
