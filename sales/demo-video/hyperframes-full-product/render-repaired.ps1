$ErrorActionPreference = 'Stop'

$project = Split-Path -Parent $MyInvocation.MyCommand.Path
$output = Join-Path (Split-Path -Parent $project) 'videos\eblock-full-product-hyperframes-repaired-1080x1920.mp4'

$inputs = @(
  '-loop', '1', '-framerate', '30', '-i', (Join-Path $project 'render-cards\card-0_8.jpg'),
  '-loop', '1', '-framerate', '30', '-i', (Join-Path $project 'render-cards\card-2_8.jpg'),
  '-i', (Join-Path $project 'assets\admin-review.mp4'),
  '-loop', '1', '-framerate', '30', '-i', (Join-Path $project 'render-cards\card-14_8.jpg'),
  '-i', (Join-Path $project 'assets\resident-access.mp4'),
  '-loop', '1', '-framerate', '30', '-i', (Join-Path $project 'render-cards\card-26_8.jpg'),
  '-i', (Join-Path $project 'assets\rent-overview.mp4'),
  '-loop', '1', '-framerate', '30', '-i', (Join-Path $project 'render-cards\card-40_8.jpg'),
  '-i', (Join-Path $project 'assets\laundry-flow.mp4'),
  '-loop', '1', '-framerate', '30', '-i', (Join-Path $project 'render-cards\card-57_8.jpg'),
  '-i', (Join-Path $project 'assets\close-context.mp4'),
  '-loop', '1', '-framerate', '30', '-i', (Join-Path $project 'render-cards\card-72.jpg'),
  '-i', (Join-Path $project 'assets\narration.mp3')
)

$arguments = @(
  '-hide_banner', '-y'
) + $inputs + @(
  '-/filter_complex', (Join-Path $project 'repair-filter.txt'),
  '-map', '[vout]', '-map', '[aout]',
  '-map_metadata', '-1', '-map_chapters', '-1', '-dn',
  '-c:v', 'libx264', '-preset', 'fast', '-crf', '18', '-profile:v', 'high', '-level', '4.1',
  '-pix_fmt', 'yuv420p', '-r', '30', '-g', '60',
  '-c:a', 'aac', '-b:a', '192k', '-ar', '48000',
  '-movflags', '+faststart', '-shortest', $output
)

& ffmpeg @arguments
if ($LASTEXITCODE -ne 0) { throw "FFmpeg failed with exit code $LASTEXITCODE" }
Write-Output $output
