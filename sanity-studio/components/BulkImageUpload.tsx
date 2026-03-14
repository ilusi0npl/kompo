import React, { useCallback, useRef, useState } from 'react'
import { useClient, type ArrayOfObjectsInputProps } from 'sanity'
import { insert, setIfMissing } from 'sanity'
import { randomKey } from '@sanity/util/content'
import { Button, Card, Flex, Stack, Text, Spinner } from '@sanity/ui'
import { UploadIcon } from '@sanity/icons'

interface UploadProgress {
  total: number
  uploaded: number
  failed: number
  inProgress: boolean
}

/**
 * Custom array input that wraps default Sanity array input
 * and adds a "Upload multiple images" button.
 *
 * Usage in schema:
 *   components: { input: BulkImageUpload }
 */
export function BulkImageUpload(props: ArrayOfObjectsInputProps) {
  const client = useClient({ apiVersion: '2025-01-16' })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [progress, setProgress] = useState<UploadProgress>({
    total: 0,
    uploaded: 0,
    failed: 0,
    inProgress: false,
  })

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return

      // Filter to image files only
      const imageFiles = Array.from(files).filter((f) =>
        f.type.startsWith('image/')
      )

      if (imageFiles.length === 0) return

      // Sort by filename for predictable order
      imageFiles.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }))

      setProgress({ total: imageFiles.length, uploaded: 0, failed: 0, inProgress: true })

      // Ensure the array exists
      props.onChange(setIfMissing([]))

      const items: any[] = []

      for (const file of imageFiles) {
        try {
          const asset = await client.assets.upload('image', file, {
            filename: file.name,
          })

          items.push({
            _type: 'image',
            _key: randomKey(12),
            asset: {
              _type: 'reference',
              _ref: asset._id,
            },
          })

          setProgress((prev) => ({ ...prev, uploaded: prev.uploaded + 1 }))
        } catch (err) {
          console.error(`Failed to upload ${file.name}:`, err)
          setProgress((prev) => ({ ...prev, failed: prev.failed + 1 }))
        }
      }

      // Insert all uploaded images at the end of the array
      if (items.length > 0) {
        props.onChange(insert(items, 'after', [-1]))
      }

      setProgress((prev) => ({ ...prev, inProgress: false }))

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    },
    [client, props]
  )

  const handleClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFiles(e.target.files)
    },
    [handleFiles]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      handleFiles(e.dataTransfer.files)
    },
    [handleFiles]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  return (
    <Stack space={3}>
      {/* Bulk upload zone */}
      <Card
        padding={4}
        radius={2}
        shadow={1}
        tone="primary"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        style={{ cursor: 'pointer', textAlign: 'center' }}
      >
        <Flex direction="column" align="center" gap={3}>
          {progress.inProgress ? (
            <>
              <Spinner muted />
              <Text size={1} muted>
                Uploading: {progress.uploaded}/{progress.total}
                {progress.failed > 0 && ` (${progress.failed} failed)`}
              </Text>
            </>
          ) : (
            <>
              <Text size={1} muted>
                Drag and drop images here
              </Text>
              <Button
                icon={UploadIcon}
                text="Select multiple images"
                tone="primary"
                mode="ghost"
                onClick={handleClick}
              />
            </>
          )}
        </Flex>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleChange}
          style={{ display: 'none' }}
        />
      </Card>

      {/* Upload summary */}
      {!progress.inProgress && progress.total > 0 && (
        <Card padding={2} radius={2} tone={progress.failed > 0 ? 'caution' : 'positive'}>
          <Text size={1}>
            Uploaded {progress.uploaded} of {progress.total} images
            {progress.failed > 0 && `. ${progress.failed} failed.`}
          </Text>
        </Card>
      )}

      {/* Default Sanity array input (standard "Add item" etc.) */}
      {props.renderDefault(props)}
    </Stack>
  )
}
