import { test } from '@argo-video/cli';

test.setTimeout(900_000);

test('eblock-complete', async ({ page, narration }) => {
  const pause = (milliseconds: number) => page.waitForTimeout(milliseconds);
  const pointAt = async (locator: ReturnType<typeof page.locator>, dwellMs = 850) => {
    await locator.scrollIntoViewIfNeeded();
    const box = await locator.boundingBox();
    if (!box) throw new Error('Expected an actionable element in the demo.');
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 18 });
    await pause(dwellMs);
  };
  const deliberateClick = async (locator: ReturnType<typeof page.locator>, dwellMs = 850) => {
    await pointAt(locator, dwellMs);
    await locator.click();
    await pause(1_350);
  };
  const back = () => deliberateClick(page.getByRole('button', { name: 'Volver' }), 700);

  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await narration.startRecording(page);

  narration.mark('welcome');
  await pause(narration.durationFor('welcome'));

  narration.mark('resident-login');
  const residentId = page.getByLabel('Cédula');
  await pointAt(residentId);
  await residentId.click();
  await residentId.pressSequentially('1034657945', { delay: 150 });
  await pause(900);
  await deliberateClick(page.getByRole('button', { name: 'Ingresar' }));
  await pause(narration.durationFor('resident-login'));

  narration.mark('retained-session');
  await pause(900);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await pause(1_700);
  await pause(narration.durationFor('retained-session'));

  narration.mark('rent-payment');
  await deliberateClick(page.getByRole('button', { name: /Ver mi arriendo/ }));
  await pause(narration.durationFor('rent-payment'));
  await back();

  narration.mark('laundry-rules');
  await deliberateClick(page.getByRole('button', { name: /Lavandería/ }).first());
  await page.getByText('Lavado + secado · 90 minutos').waitFor();
  await pause(narration.durationFor('laundry-rules'));

  narration.mark('laundry-confirmation');
  await deliberateClick(page.getByRole('button', { name: /09:30–11:00/ }));
  await pause(1_200);
  await deliberateClick(page.getByRole('button', { name: 'Confirmar lavado + secado' }));
  await page.getByText('Reserva confirmada').waitFor();
  await pause(narration.durationFor('laundry-confirmation'));

  narration.mark('laundry-history');
  await deliberateClick(page.getByRole('button', { name: 'Volver al inicio' }));
  await deliberateClick(page.getByRole('button', { name: /Lavandería/ }).first());
  await page.getByText('Mi historial de lavadas').waitFor();
  await pause(narration.durationFor('laundry-history'));
  await back();

  narration.mark('kitchen-flow');
  await deliberateClick(page.getByRole('button', { name: /Cocina/ }).first());
  await page.getByText('Cocina compartida').waitFor();
  await deliberateClick(page.getByRole('button', { name: '16:00', exact: true }));
  await pause(800);
  await deliberateClick(page.getByRole('button', { name: 'Confirmar turno' }));
  await page.getByText('Mi historial').scrollIntoViewIfNeeded();
  await pause(narration.durationFor('kitchen-flow'));
  await back();

  narration.mark('switch-to-diana');
  await deliberateClick(page.getByRole('button', { name: 'Salir' }));
  const adminId = page.getByLabel('Cédula');
  await pointAt(adminId);
  await adminId.click();
  await adminId.pressSequentially('1034657946', { delay: 150 });
  await deliberateClick(page.getByRole('button', { name: 'Ingresar' }));
  await pause(narration.durationFor('switch-to-diana'));

  narration.mark('admin-preview');
  await page.mouse.wheel(0, 460);
  await pause(1_100);
  await pause(narration.durationFor('admin-preview'));
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await pause(800);

  narration.mark('admin-laundry-review');
  await deliberateClick(page.getByRole('button', { name: /Lavandería/ }).first());
  await page.getByText('Control de lavandería').waitFor();
  const markPaid = page.getByRole('button', { name: 'Marcar pago recibido' }).first();
  await pointAt(markPaid, 1_000);
  await markPaid.click();
  await pause(1_600);
  await pause(narration.durationFor('admin-laundry-review'));

  narration.mark('close');
  await pause(narration.durationFor('close'));
});
