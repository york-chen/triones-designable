import React from 'react';
import { Upload as FormilyUpload } from '@formily/antd-v5';
import { createBehavior, createResource } from '@trionesdev/designable-core';
import { DnFC } from '@trionesdev/designable-react';
import { createFieldSchema } from '../Field';
import { AllSchemas } from '../../schemas';
import { AllLocales } from '../../locales';

export const CustomUpload: DnFC<React.ComponentProps<typeof FormilyUpload>> =
  FormilyUpload;

  CustomUpload.Behavior = createBehavior(
  {
    name: 'CustomUpload',
    extends: ['Field'],
    selector: (node) => node.props['x-component'] === 'CustomUpload',
    designerProps: {
      propsSchema: createFieldSchema(AllSchemas.Upload),
    },
    designerLocales: AllLocales.Upload,
  },
  {
    name: 'CustomUpload.Dragger',
    extends: ['Field'],
    selector: (node) => node.props['x-component'] === 'CustomUpload.Dragger',
    designerProps: {
      propsSchema: createFieldSchema(AllSchemas.Upload.Dragger),
    },
    designerLocales: AllLocales.UploadDragger,
  },
);

CustomUpload.Resource = createResource(
  {
    icon: 'UploadSource',
    elements: [
      {
        componentName: 'Field',
        props: {
          type: 'Array<object>',
          title: 'Upload',
          'x-decorator': 'FormItem',
          'x-component': 'CustomUpload',
          'x-component-props': {
            textContent: 'Upload',
          },
        },
      },
    ],
  },
  {
    icon: 'UploadDraggerSource',
    elements: [
      {
        componentName: 'Field',
        props: {
          type: 'Array<object>',
          title: 'Drag Upload',
          'x-decorator': 'FormItem',
          'x-component': 'CustomUpload.Dragger',
          'x-component-props': {
            textContent: 'Click or drag file to this area to upload',
          },
        },
      },
    ],
  },
);
