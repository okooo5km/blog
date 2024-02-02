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
  title: 'Block Content',
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
      of: [
        {
          type: 'object',
          name: 'inlineLatex',
          components: { preview: LatexPreview },
          icon: mathInlineIcon,
          title: 'Inline LaTeX',
          fields: [
            {
              title: 'LaTeX content',
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
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'H1', value: 'h1' },
        { title: 'H2', value: 'h2' },
        { title: 'H3', value: 'h3' },
        { title: 'H4', value: 'h4' },
        { title: 'Quote', value: 'blockquote' },
      ],
      lists: [
        { title: 'Bullet', value: 'bullet' },
        { title: 'Numbered', value: 'number' },
      ],
      // Marks let you mark up inline text in the Portable Text Editor
      marks: {
        // Decorators usually describe a single property – e.g. a typographic
        // preference or highlighting
        decorators: [
          { title: 'Strong', value: 'strong' },
          { title: 'Emphasis', value: 'em' },
          { title: 'Underline', value: 'underline' },
          { title: 'Strike', value: 'strike-through' },
          { title: 'Code', value: 'code' },
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
      type: 'image',
      icon: ImageIcon,
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
        },
        {
          name: 'label',
          type: 'string',
          title: 'Label',
        },
      ],
    }),
    defineArrayMember({
      type: 'latex',
      icon: mathIcon,
      title: 'Math block',
    }),
    defineArrayMember({
      type: 'object',
      name: 'tweet',
      title: 'Tweet',
      icon: TweetIcon,
      fields: [
        {
          name: 'id',
          type: 'string',
          title: 'Tweet ID',
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
      title: 'Video',
      icon: VideoIcon,
      fields: [
        {
          name: 'url',
          type: 'string',
          title: 'Video URL',
        },
        {
          name: 'title',
          type: 'string',
          title: 'Video Title',
          initialValue: '',
        },
        {
          name: 'source',
          type: 'string',
          title: 'Video Source',
          initialValue: 'url',
          options: {
            list: [
              { title: 'URL', value: 'url' },
              { title: 'Youtube', value: 'youtube' },
              { title: 'Bilibili', value: 'bilibili' },
              { title: 'Vimeo', value: 'vimeo' },
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
          title: 'title',
        },
      },
    }),
    defineArrayMember({
      type: 'object',
      name: 'otherImage',
      title: 'Web Image',
      icon: OtherImageIcon,
      fields: [
        {
          name: 'url',
          type: 'string',
          title: 'Image Url',
        },
        {
          name: 'label',
          type: 'string',
          title: 'Image Label',
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
      title: 'Code Block',
      options: {
        withFilename: true,
      },
    }),
    defineArrayMember({
      name: 'table',
      title: 'table',
      type: 'table',
      icon: TableIcon,
    }),
  ],
})
