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
            Write-Host
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


# Create JSON-like container from ordered hashtable for final output
$Packed = [PSCustomObject][Ordered]@{
    count = $Files.Count
    data  = New-Object -TypeName PSCustomObject
}

$GeneratedGUIDs = 0
$RenamedFiles = 0
foreach ($File in $Files)
{
    $JSON = Get-Content $File | ConvertFrom-Json


    # Make sure each JSON has a (valid) GUID

    # Check if property 'guid' exists on object
    if (!$JSON.PSObject.Properties.Name -contains 'guid') 
    {
        $JSON | Add-Member -NotePropertyName 'guid' -NotePropertyValue (New-Guid).Guid
        ConvertTo-Json $JSON | Out-File $File
        $GeneratedGUIDs++
    }
    # Check if property 'guid' is empty or an invalid GUID
    elseif (![System.Guid]::TryParse($JSON.guid, [ref][System.Guid]::empty))
    {
        $JSON.guid = (New-Guid).Guid
        ConvertTo-Json $JSON | Out-File $File
        $GeneratedGUIDs++
    }


    # Format the filenames as 'brand-guid.json'

    # Check if property brand exists and is not empty
    if (!$JSON.PSObject.Properties.Name -contains 'brand' -or !$JSON.brand)
    {
        $Filename = 'Unknown-' + $JSON.guid + '.json'
    }
    else
    {
        $Filename = $JSON.brand.Replace(' ', '_') + '-' + $JSON.guid + '.json'
    }

    # Rename if filename not equal to computed one (case-sensitive)
    if ($File.Name -cne $Filename)
    {
        Write-Host $File.Name '->' $Filename
        Rename-Item -LiteralPath $File.FullName -NewName $Filename
        $RenamedFiles++
    }


    # Pack JSONs
    $Packed.data | Add-Member -NotePropertyName $JSON.guid -NotePropertyValue $JSON
}


# Write container
if (!(Test-Path -LiteralPath $($Path + '/packed') -PathType Container))
{
    # void avoids console output
    [void](New-Item -Path $Path -Name 'packed' -ItemType Directory)
}
$Filepath = $Path + '/packed/PackedJSONs.json'
ConvertTo-Json $Packed -Depth 5 -Compress | Out-File -LiteralPath $Filepath


Write-Host
Write-Host 'GUIDs generated:' $GeneratedGUIDs
Write-Host 'Files renamed:' $RenamedFiles "`n"
Write-Host 'Packed' $Packed.count 'JSONs into' $Filepath
