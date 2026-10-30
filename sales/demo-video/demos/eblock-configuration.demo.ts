import { test } from '@argo-video/cli';

test.setTimeout(180_000);

test('eblock-configuration', async ({ page, narration }) => {
  const pause = (milliseconds: number) => page.waitForTimeout(milliseconds);
  const pointAt = async (locator: ReturnType<typeof page.locator>, dwellMs = 700) => {
    const box = await locator.boundingBox();
    if (!box) throw new Error('Expected an actionable element in the demo.');
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 14 });
    await pause(dwellMs);
  };
  const deliberateClick = async (locator: ReturnType<typeof page.locator>, dwellMs = 700) => {
    await pointAt(locator, dwellMs);
    await locator.click();
    await pause(1100);
  };

  await page.goto('/', { waitUntil: 'networkidle' });
  await narration.startRecording(page);

  narration.mark('intro');
  await pause(narration.durationFor('intro'));

  narration.mark('resident-access');
  const residentId = page.locator('input');
  await pointAt(residentId, 850);
  await residentId.click();
  await residentId.pressSequentially('1034657945', { delay: 135 });
  await pause(850);
  await deliberateClick(page.getByRole('button', { name: 'Ingresar' }));
  await pause(narration.durationFor('resident-access'));

  narration.mark('rental-overview');
  await deliberateClick(page.getByRole('button', { name: /Ver mi arriendo/ }));
  await pause(narration.durationFor('rental-overview'));
  await deliberateClick(page.getByRole('button').first(), 600);
  await pause(850);

  narration.mark('laundry-selection');
  await deliberateClick(page.getByRole('button', { name: /Lavandería/ }));
  await deliberateClick(page.getByRole('button', { name: /Lavadora 1/ }), 550);
  await deliberateClick(page.getByRole('button', { name: /jue\s*3/i }), 550);
  await deliberateClick(page.getByRole('button', { name: '10:00', exact: true }), 550);
  // Stops before confirming: the recording never writes a reservation.
  await pause(narration.durationFor('laundry-selection'));

  await deliberateClick(page.getByRole('button').first(), 550);
  await deliberateClick(page.getByRole('button', { name: 'Salir' }), 550);
  await page.locator('input').waitFor();
  await pause(900);

  narration.mark('admin-view');
  const adminId = page.locator('input');
  await pointAt(adminId, 800);
  await adminId.click();
  await adminId.pressSequentially('1034657946', { delay: 125 });
  await pause(800);
  await deliberateClick(page.getByRole('button', { name: 'Ingresar' }));
  await pause(narration.durationFor('admin-view'));

  narration.mark('close');
  await pause(narration.durationFor('close'));
});
