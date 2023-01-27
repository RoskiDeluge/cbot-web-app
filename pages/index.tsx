import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import { Button, Form, Spinner } from "react-bootstrap";
import { FormEvent, useState } from "react";

export default function Home() {
  const [quote, setQuote] = useState("");
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteLoadingError, setQuoteLoadingError] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const prompt = formData.get("prompt")?.toString().trim();

    if (prompt) {
      try {
        setQuote("");
        setQuoteLoadingError(false);
        setQuoteLoading(true);

        const response = await fetch(
          "/api/cbot?prompt=" + encodeURIComponent(prompt)
        );
        const body = await response.json();
        setQuote(body.command);
      } catch (error) {
        console.log(error);
        setQuoteLoadingError(true);
      } finally {
        setQuoteLoading(false);
      }
    }
  }

  return (
    <>
      <Head>
        <title>CBOT Web Demo</title>
        <meta name="description" content="by RD" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1>CBOT Web Demo</h1>
        <h3>Powered by GPT-3</h3>
        <div>Enter a question and AI will generate the command.</div>
        <Form onSubmit={handleSubmit} className={styles.inputForm}>
          <Form.Group className="mb-3" controlId="prompt-input">
            <Form.Label>Get your command...</Form.Label>
            <Form.Control
              name="prompt"
              placeholder="e.g. how do I list files in my current directory?"
              maxLength={100}
            />
          </Form.Group>
          <Button type="submit" className="mb-3" disabled={quoteLoading}>
            Go
          </Button>
        </Form>
        {quoteLoading && <Spinner animation="border" />}
        {quoteLoadingError && "Something went wrong, please try again."}
        {quote && <h5 className={styles.quote}>{quote}</h5>}
      </main>
    </>
  );
}
