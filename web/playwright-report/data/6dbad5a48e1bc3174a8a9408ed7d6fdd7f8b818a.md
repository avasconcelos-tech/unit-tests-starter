# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: clientes.spec.js >> mostra erro ao editar para um email ja cadastrado
- Location: e2e\clientes.spec.js:62:1

# Error details

```
Error: locator.click: Target page, context or browser has been closed
Call log:
  - waiting for getByRole('row', { name: /Bruno Lima/ }).getByRole('button', { name: 'Editar' })

```

```
Error: browserContext.close: Target page, context or browser has been closed
```