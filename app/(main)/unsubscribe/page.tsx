'use client'
import { useState } from 'react'
import Balancer from 'react-wrap-balancer'

import { Container } from '~/components/ui/Container'

const description =
  '虽然我们此刻道别，但爱与期待依然存在。🌱 您随时可以重新订阅，每一篇文章都在这里耐心等候。💌 无论何时回来，都将受到同样温暖的欢迎。期待与您的再次重逢！'

export default function UnsubscribePage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle')
  const [message, setMessage] = useState('')

  const handleUnsubscribe = async () => {
    if (!email) {
      setStatus('error')
      setMessage('请输入邮箱地址')
      return
    }

    try {
      setStatus('loading')
      const response = await fetch('/api/newsletter/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: { email }, // 使用实际输入的邮箱，而不是硬编码的值
        }),
      })

      const data: { error?: string; status?: string } = JSON.parse(await response.text())

      if (!response.ok) {
        setStatus('error')
        // 使用后端返回的具体错误信息
        setMessage(data.error || '退订失败，请稍后重试')
        return
      }

      if (data.status === 'success') {
        setStatus('success')
        setMessage('退订成功！感谢您曾经的关注')
        setEmail('') // 清空输入框
      }
    } catch (error) {
      setStatus('error')
      setMessage('网络错误，请稍后重试')
    }
  }

  return (
    <Container className="mt-16 sm:mt-24">
      <header className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
          🙏 感谢您的关注
        </h1>
        <p className="my-4 text-base text-zinc-600 dark:text-zinc-400">
          <Balancer>{description}</Balancer>
        </p>
      </header>
      <div className="mt-12 flex justify-center sm:mt-20">
        <div className="flex w-5/6 flex-col items-center justify-center rounded-xl border border-zinc-200/40 bg-zinc-200/20 p-8 text-center dark:border-zinc-700/50 dark:bg-zinc-800/60 lg:w-1/2">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            取消订阅
          </h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            请输入您要退订的邮箱地址
          </p>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            disabled={status === 'success'} // 成功后禁用输入
            className="mt-4 w-full max-w-sm rounded-lg border border-zinc-300 px-4 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          />

          <button
            onClick={handleUnsubscribe}
            disabled={status === 'loading' || status === 'success'}
            className="mt-6 rounded-lg border border-red-400/20 bg-red-500 px-4 py-2 text-white transition hover:bg-red-600 disabled:opacity-50 dark:border-red-500/30"
          >
            {status === 'loading'
              ? '处理中...'
              : status === 'success'
                ? '已退订'
                : '确认退订'}
          </button>

          {message && (
            <p className={`mt-4 text-sm text-zinc-800 dark:text-zinc-200`}>
              {message}
            </p>
          )}
        </div>
      </div>
    </Container>
  )
}
