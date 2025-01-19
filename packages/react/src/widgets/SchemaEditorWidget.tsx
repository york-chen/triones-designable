import React from 'react'
import {
  transformToSchema,
  transformToTreeNode,
} from '@trionesdev/designable-formily-transformer'
import { TreeNode, ITreeNode } from '@trionesdev/designable-core'
import { MonacoInput } from '@trionesdev/designable-react-settings-form'

export interface ISchemaEditorWidgetProps {
  tree: TreeNode
  onChange?: (tree: ITreeNode) => void
}

export const SchemaEditorWidget: React.FC<ISchemaEditorWidgetProps> = (
  props
) => {
  return (
    <MonacoInput
      {...props}
      value={JSON.stringify(transformToSchema(props.tree), null, 2)}
      onChange={(value) => {
        props.onChange?.(transformToTreeNode(JSON.parse(value)))
      }}
      language="json"
    />
  )
}