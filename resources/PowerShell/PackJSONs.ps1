#Requires -Version 7.2

# Ask the user for the folder path
while ($true)
{
    $Path = Read-Host 'Please enter the JSONs folder path (full or relative)'
    if (Test-Path -LiteralPath $Path -PathType Container)
    {
        $Files = @(Get-ChildItem -LiteralPath $Path -File -Include '*.json' -Exclude 'PackedJSONs.json')
        if (!$Files)
        {
            Write-Host "No JSON files found in: $Path" -ForegroundColor Red
        }
        else
        {
            break
        }
    }
    else
    {
        if ($Path -like 'quit' -or $Path -like 'exit')
        {
            Exit
        }
        Write-Host 'Not a valid folder path.' -ForegroundColor Red
    }
}

# Create JSON-like container from ordered hashtable
$Packed = [PSCustomObject][Ordered]@{
    count = $Files.Count
    data  = New-Object Collections.Generic.List[PSCustomObject]($Files.Count)
}

# Pack JSONs
foreach ($File in $Files)
{
    $JSON = Get-Content $File | ConvertFrom-Json
    $Packed.Data.Add($JSON)
}

# Write container
if (!(Test-Path -LiteralPath $($Path + '/packed') -PathType Container))
{
    # void avoids console output
    [void](New-Item -Path $Path -Name 'packed' -ItemType Directory)
}
$Filepath = $Path + '/packed/PackedJSONs.json'
ConvertTo-Json $Packed -Depth 5 -Compress | Out-File -LiteralPath $Filepath

Write-Host 'Packed' $Packed.count 'JSONs into' $Filepath
