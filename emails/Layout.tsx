import * as React from 'react'

import { emailConfig } from '../config/email'
import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from './_components'

export default function Layout({
  previewText,
  children,
  unsubscribeUrl,
}: {
  previewText: string
  children: React.ReactNode
  unsubscribeUrl?: string
}) {
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-zinc-50 pt-[32px] font-sans">
          <Container className="mx-auto my-[40px] w-[465px] max-w-[465px] rounded-2xl border border-solid border-zinc-100 bg-white px-[24px] py-[20px]">
            {children}
          </Container>

          <Container className="mx-auto mt-[32px] w-[465px]">
            <Hr className="mx-0 my-[20px] h-px w-full bg-zinc-100" />
            <Section>
              <img
                src={`${emailConfig.baseUrl}/icon.svg`}
                width="24"
                height="24"
                alt="十里"
                className="mx-auto my-0"
              />
              <Text className="text-center">
                <Link
                  href="https://5km.studio"
                  className="text-zinc-700 underline"
                >
                  <strong>十里</strong>
                </Link>
                <br />
                产品匠、设计师、细节控、独立创客
              </Text>
              <Text className="text-center">
                <Link
                  href="/twitter"
                  className="text-xs text-zinc-600 underline"
                >
                  Twitter
                </Link>{' '}
                |&nbsp;
                <Link
                  href="/github"
                  className="text-xs text-zinc-600 underline"
                >
                  GitHub
                </Link>
              </Text>
              {/* 添加取消订阅链接 */}
              {unsubscribeUrl && (
                <Text className="mt-4 text-center text-xs text-zinc-400">
                  如果您不想继续接收此类邮件，可以
                  <Link
                    href={unsubscribeUrl}
                    className="text-zinc-400 underline"
                  >
                    点击这里退订
                  </Link>
                </Text>
              )}
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
