/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineArrayMember, defineType } from 'sanity'
import { LatexPreview } from 'sanity-plugin-latex-input'

import {
  ImageIcon,
  mathIcon,
  mathInlineIcon,
  OtherImageIcon,
  TableIcon,
  TweetIcon,
  VideoIcon,
} from '~/sanity/components/Icons'
import { OtherImagePreview } from '~/sanity/components/OtherImagePreview'
import { Tweet } from '~/sanity/components/Tweet'
import { VideoPreview } from '~/sanity/components/VideoPreview'

/**
 * This is the schema type for block content used in the post document type
 * Importing this type into the studio configuration's `schema` property
 * lets you reuse it in other document types with:
 *  {
 *    name: 'someName',
 *    title: 'Some title',
 *    type: 'blockContent'
 *  }
 */
export default defineType({
  title: '块级富文本',
  name: 'blockContent',
  type: 'array',
  of: [
    defineArrayMember({
      title: 'Block',
      type: 'block',
      // Styles let you define what blocks can be marked up as. The default
      // set corresponds with HTML tags, but you can set any title or value
      // you want, and decide how you want to deal with it where you want to
      // use your content.
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      of: [
        {
          type: 'object',
          name: 'inlineLatex',
          components: { preview: LatexPreview },
          icon: mathInlineIcon,
          title: '行内公式',
          fields: [
            {
              title: 'LaTeX公式',
              name: 'body',
              type: 'text',
            },
          ],
          preview: {
            select: {
              body: 'body',
            },
          },
        },
      ],
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      styles: [
        { title: '正文', value: 'normal' },
        { title: 'H1', value: 'h1' },
        { title: 'H2', value: 'h2' },
        { title: 'H3', value: 'h3' },
        { title: 'H4', value: 'h4' },
        { title: '引用', value: 'blockquote' },
      ],
      lists: [
        { title: '无序列表', value: 'bullet' },
        { title: '有序列表', value: 'number' },
      ],
      // Marks let you mark up inline text in the Portable Text Editor
      marks: {
        // Decorators usually describe a single property – e.g. a typographic
        // preference or highlighting
        decorators: [
          { title: '加粗', value: 'strong' },
          { title: '斜体', value: 'em' },
          { title: '下划线', value: 'underline' },
          { title: '删除线', value: 'strike-through' },
          { title: '行内代码', value: 'code' },
        ],
        // Annotations can be any object structure – e.g. a link or a footnote.
        annotations: [
          {
            title: 'URL',
            name: 'link',
            type: 'object',
            fields: [
              {
                title: 'URL',
                name: 'href',
                type: 'url',
              },
            ],
          },
        ],
      },
    }),
    // You can add additional types here. Note that you can't use
    // primitive types such as 'string' and 'number' in the same array
    // as a block type.
    defineArrayMember({
      title: '图片',
      type: 'image',
      icon: ImageIcon,
      options: { hotspot: true },
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: '替代文本',
        },
        {
          name: 'label',
          type: 'string',
          title: '标注',
        },
      ],
    }),
    defineArrayMember({
      type: 'latex',
      icon: mathIcon,
      title: '块级公式',
    }),
    defineArrayMember({
      type: 'object',
      name: 'tweet',
      title: '推文',
      icon: TweetIcon,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      fields: [
        {
          name: 'id',
          type: 'string',
          title: '推文 ID',
        },
      ],
      components: {
        preview: Tweet as any,
      },
      preview: {
        select: {
          id: 'id',
        },
      },
    }),
    defineArrayMember({
      type: 'object',
      name: 'video',
      title: '视频',
      icon: VideoIcon,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      fields: [
        {
          name: 'url',
          type: 'string',
          title: '视频链接',
        },
        {
          name: 'title',
          type: 'string',
          title: '视频标题',
          initialValue: '',
        },
        {
          name: 'source',
          type: 'string',
          title: '视频源',
          initialValue: 'url',
          options: {
            list: [
              { title: '直链', value: 'url' },
              { title: 'Youtube 链接', value: 'youtube' },
              { title: 'B 站链接', value: 'bilibili' },
              { title: 'Vimeo 链接', value: 'vimeo' },
            ],
          },
        },
      ],
      components: {
        preview: VideoPreview as any,
      },
      preview: {
        select: {
          url: 'url',
          source: 'source',
          title: '标题',
        },
      },
    }),
    defineArrayMember({
      type: 'object',
      name: 'otherImage',
      title: '直链图片',
      icon: OtherImageIcon,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      fields: [
        {
          name: 'url',
          type: 'string',
          title: '链接',
        },
        {
          name: 'label',
          type: 'string',
          title: '标注',
          initialValue: '',
        },
      ],
      components: {
        preview: OtherImagePreview as any,
      },
      preview: {
        select: {
          url: 'url',
        },
      },
    }),
    defineArrayMember({
      type: 'code',
      name: 'codeBlock',
      title: '块级代码',
      options: {
        withFilename: true,
      },
    }),
    defineArrayMember({
      name: 'table',
      title: '表格',
      type: 'table',
      icon: TableIcon,
    }),
  ],
})
