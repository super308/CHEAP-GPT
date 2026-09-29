"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useEffect, useState } from "react";

type Chat = {
  id: string;
  title: string;
  messages: any[];
  createdAt: string;
};

const suggestions = [
  {
    icon: "💡",
    title: "Explain something",
    text: "Explain quantum computing in simple language",
  },
  {
    icon: "💻",
    title: "Write code",
    text: "Write a C++ program to reverse a string",
  },
  {
    icon: "📚",
    title: "Study with me",
    text: "Teach me DBMS normalization with examples",
  },
  {
    icon: "🚀",
    title: "Build a project",
    text: "Give me a full-stack project idea for my portfolio",
  },
];

export default function Home() {
  const [input, setInput] = useState("");

  const [chats, setChats] = useState<Chat[]>([]);

  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  const activeChat = chats.find((chat) => chat.id === activeChatId);

  const {
    messages,
    sendMessage,
    status,
    setMessages,
  } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  const isLoading = status === "submitted" || status === "streaming";
  useEffect(() => {
  if (!activeChatId) return;

  setChats((previous) =>
    previous.map((chat) => {
      if (chat.id !== activeChatId) {
        return chat;
      }

      const firstUserMessage = messages.find(
        (message) => message.role === "user"
      );

      let title = chat.title;

      if (chat.title === "New conversation" && firstUserMessage) {
        const firstTextPart = firstUserMessage.parts?.find(
          (part: any) => part.type === "text"
        )as { type: "text"; text: string } | undefined;

        if (firstTextPart?.text) {
          title = firstTextPart.text.slice(0, 35);

          if (firstTextPart.text.length > 35) {
            title += "...";
          }
        }
      }

      return {
        ...chat,
        title,
        messages,
      };
    })
  );
}, [messages, activeChatId]);

  // Create a new chat
  const createNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: "New conversation",
      messages: [],
      createdAt: new Date().toLocaleDateString(),
    };

    setChats((previous) => [newChat, ...previous]);
    setActiveChatId(newChat.id);
    setMessages([]);
    setInput("");
  };

  // Select an existing chat
  const selectChat = (chat: Chat) => {
    setActiveChatId(chat.id);
    setMessages(chat.messages);
    setInput("");
  };
  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || isLoading) return;

    
    if (!activeChatId) {
  const newChat: Chat = {
    id: Date.now().toString(),
    title: "New conversation",
    messages: [],
    createdAt: new Date().toLocaleDateString(),
  };

  setChats((previous) => [newChat, ...previous]);
  setActiveChatId(newChat.id);
}

    sendMessage({ text: input });

    setInput("");
  };

  const handleSuggestion = (text: string) => {
    if (isLoading) return;

   if (!activeChatId) {
  const newChat: Chat = {
    id: Date.now().toString(),
    title: "New conversation",
    messages: [],
    createdAt: new Date().toLocaleDateString(),
  };

  setChats((previous) => [newChat, ...previous]);
  setActiveChatId(newChat.id);
}

    sendMessage({ text });
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#050507] text-white">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-violet-600/10 blur-[140px]" />
        <div className="absolute -right-40 top-1/3 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[140px]" />
        <div className="absolute bottom-[-200px] left-1/3 h-[450px] w-[450px] rounded-full bg-fuchsia-600/10 blur-[140px]" />
      </div>

      <div className="relative flex min-h-screen">

        {/* SIDEBAR */}

        <aside className="hidden w-[270px] flex-col border-r border-white/[0.08] bg-white/[0.025] backdrop-blur-xl lg:flex">

          {/* NEW CHAT */}

          <div className="p-5">
            <button
              onClick={createNewChat}
              className="flex w-full items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm font-medium transition hover:border-violet-500/30 hover:bg-white/[0.08]"
            >
              <span className="text-lg">＋</span>
              New Chat
            </button>
          </div>

          {/* CHAT LIST */}

          <div className="flex-1 overflow-y-auto px-3">

            {chats.length === 0 ? (
              <div className="px-3 py-8 text-center">
                <p className="text-xs text-white/25">
                  Your conversations will appear here.
                </p>
              </div>
            ) : (
              <>
                <p className="px-2 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">
                  Conversations
                </p>

                <div className="space-y-1">
                  {chats.map((chat) => (
                    <button
                      key={chat.id}
                      onClick={() => selectChat(chat)}
                      className={`w-full rounded-xl px-3 py-3 text-left transition ${
                        activeChatId === chat.id
                          ? "border border-violet-500/20 bg-violet-500/10"
                          : "border border-transparent hover:bg-white/[0.05]"
                      }`}
                    >
                      <p className="truncate text-sm text-white/80">
                        {chat.title}
                      </p>

                      <p className="mt-1 text-[10px] text-white/25">
                        {chat.createdAt}
                      </p>
                    </button>
                  ))}
                </div>
              </>
            )}

          </div>

          {/* SIDEBAR FOOTER */}

          <div className="border-t border-white/[0.07] p-4">

            <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-4">

              <div className="flex items-center gap-2">

                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,.8)]" />

                <span className="text-xs text-white/50">
                  Gemini connected
                </span>

              </div>

              <p className="mt-3 text-[11px] leading-5 text-white/25">
                CHEAP-GPT AI assistant
              </p>

            </div>

          </div>

        </aside>

        {/* MAIN CONTENT */}

        <section className="flex min-h-screen flex-1 flex-col">

          {/* HEADER */}

          <header className="sticky top-0 z-20 flex h-[72px] items-center justify-between border-b border-white/[0.07] bg-[#050507]/70 px-5 backdrop-blur-xl md:px-8">

            <div className="flex items-center gap-3">

              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500 shadow-lg shadow-violet-500/20">

                <span className="text-lg">
                  ✦
                </span>

                <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-[#050507] bg-emerald-400" />

              </div>

              <div>

                <h1 className="text-sm font-semibold tracking-wide">
                  CHEAP-GPT
                </h1>

                <div className="flex items-center gap-1.5 text-[11px] text-white/35">

                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                  Gemini 3.8 Flash

                </div>

              </div>

            </div>

            <div className="hidden rounded-full border border-white/[0.07] bg-white/[0.03] px-3 py-1.5 sm:block">

              <span className="text-xs text-violet-300">
                ● Online
              </span>

            </div>

          </header>

          {/* CHAT AREA */}

          <div className="flex-1 overflow-y-auto px-4 py-8 md:px-8">

            <div className="mx-auto max-w-4xl">

              {/* WELCOME */}

              {messages.length === 0 && (

                <div className="flex min-h-[calc(100vh-240px)] flex-col items-center justify-center">

                  <div className="relative mb-8">

                    <div className="absolute inset-0 rounded-full bg-violet-500/30 blur-3xl animate-pulse" />

                    <div className="relative flex h-24 w-24 items-center justify-center rounded-[30px] border border-white/10 bg-gradient-to-br from-violet-500/20 via-purple-500/10 to-blue-500/20 shadow-2xl shadow-violet-500/20">

                      <span className="text-4xl">
                        ✦
                      </span>

                    </div>

                  </div>

                  <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-violet-300/70">
                    Your personal AI
                  </p>

                  <h2 className="text-center text-4xl font-bold tracking-tight md:text-6xl">

                    What can I help
                    <br />

                    <span className="bg-gradient-to-r from-violet-400 via-fuchsia-300 to-blue-400 bg-clip-text text-transparent">
                      you build?
                    </span>

                  </h2>

                  <p className="mt-5 max-w-lg text-center text-sm leading-6 text-white/35 md:text-base">
                    Ask questions, write code, learn new concepts,
                    brainstorm ideas, or build something amazing.
                  </p>

                  <div className="mt-10 grid w-full max-w-3xl grid-cols-1 gap-3 sm:grid-cols-2">

                    {suggestions.map((item) => (

                      <button
                        key={item.title}
                        onClick={() => handleSuggestion(item.text)}
                        className="group rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 text-left backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-violet-500/30 hover:bg-white/[0.05]"
                      >

                        <div className="mb-3 flex items-center justify-between">

                          <span className="text-xl">
                            {item.icon}
                          </span>

                          <span className="text-white/20 transition group-hover:translate-x-1 group-hover:text-violet-300">
                            →
                          </span>

                        </div>

                        <p className="text-sm font-medium">
                          {item.title}
                        </p>

                        <p className="mt-1 text-xs leading-5 text-white/30">
                          {item.text}
                        </p>

                      </button>

                    ))}

                  </div>

                </div>

              )}

              {/* MESSAGES */}

              <div className="space-y-7">

                {messages.map((message) => (

                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.role === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >

                    {message.role !== "user" && (

                      <div className="mt-1 hidden h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 shadow-lg sm:flex">
                        ✦
                      </div>

                    )}

                    <div className="max-w-[85%] md:max-w-[75%]">

                      <div
                        className={`rounded-2xl px-5 py-3.5 text-sm leading-7 ${
                          message.role === "user"
                            ? "rounded-br-md bg-gradient-to-br from-violet-600 to-blue-600"
                            : "rounded-bl-md border border-white/[0.07] bg-white/[0.045] text-white/85"
                        }`}
                      >

                        {message.parts.map((part: any, index: number) => {

                          if (part.type === "text") {

                            return (

                              <div key={index} className="max-w-none">

                                <ReactMarkdown
                                  remarkPlugins={[remarkGfm]}
                                  components={{
                                    code({
                                      className,
                                      children,
                                      ...props
                                    }) {

                                      const match =
                                        /language-(\w+)/.exec(
                                          className || ""
                                        );

                                      if (match) {

                                        return (

                                          <div className="my-4 overflow-hidden rounded-xl border border-white/10">

                                            <div className="flex items-center justify-between border-b border-white/10 bg-black/30 px-4 py-2">

                                              <span className="text-xs text-white/40">
                                                {match[1]}
                                              </span>

                                              <button
                                                onClick={() =>
                                                  navigator.clipboard.writeText(
                                                    String(children)
                                                  )
                                                }
                                                className="text-xs text-white/40 transition hover:text-white"
                                              >
                                                Copy
                                              </button>

                                            </div>

                                            <SyntaxHighlighter
                                              style={oneDark}
                                              language={match[1]}
                                              PreTag="div"
                                              className="!m-0 !rounded-none"
                                            >
                                              {String(children).replace(
                                                /\n$/,
                                                ""
                                              )}
                                            </SyntaxHighlighter>

                                          </div>

                                        );

                                      }

                                      return (

                                        <code
                                          className="rounded-md bg-black/30 px-1.5 py-0.5 text-sm text-violet-300"
                                          {...props}
                                        >
                                          {children}
                                        </code>

                                      );

                                    },
                                  }}
                                >
                                  {part.text}
                                </ReactMarkdown>

                              </div>

                            );

                          }

                          return null;

                        })}

                      </div>

                      <p
                        className={`mt-2 text-[10px] text-white/20 ${
                          message.role === "user"
                            ? "text-right"
                            : "text-left"
                        }`}
                      >
                        {message.role === "user"
                          ? "You"
                          : "CHEAP-GPT • Gemini"}
                      </p>

                    </div>

                  </div>

                ))}

                {isLoading && (

                  <div className="flex items-start gap-3">

                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-blue-500">
                      ✦
                    </div>

                    <div className="rounded-2xl rounded-bl-md border border-white/[0.07] bg-white/[0.045] px-5 py-4">

                      <div className="flex items-center gap-1.5">

                        <span className="typing-dot h-1.5 w-1.5 rounded-full bg-violet-300" />
                        <span className="typing-dot h-1.5 w-1.5 rounded-full bg-violet-300" />
                        <span className="typing-dot h-1.5 w-1.5 rounded-full bg-violet-300" />

                      </div>

                    </div>

                  </div>

                )}

              </div>

            </div>

          </div>

          {/* INPUT */}

          <div className="sticky bottom-0 border-t border-white/[0.07] bg-[#050507]/80 px-4 pb-5 pt-4 backdrop-blur-xl md:px-8">

            <form
              onSubmit={handleSubmit}
              className="mx-auto max-w-4xl"
            >

              <div className="relative rounded-2xl border border-white/[0.1] bg-white/[0.045] p-2 shadow-2xl backdrop-blur-xl focus-within:border-violet-500/40">

                <div className="flex items-end gap-2">

                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {

                      if (
                        e.key === "Enter" &&
                        !e.shiftKey
                      ) {

                        e.preventDefault();

                        handleSubmit(e);

                      }

                    }}
                    placeholder="Message CHEAP-GPT..."
                    rows={1}
                    className="max-h-32 min-h-[48px] flex-1 resize-none bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-white/25"
                  />

                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 shadow-lg transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    ↑
                  </button>

                </div>

              </div>

              <p className="mt-3 text-center text-[10px] text-white/20">
                CHEAP-GPT can make mistakes. Check important information.
              </p>

            </form>

          </div>

        </section>

      </div>

    </main>
  );
}