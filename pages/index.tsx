import Head from "next/head";
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

  async function handleSubmitTwo(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const prompt = formData.get("prompt")?.toString().trim();

    if (prompt) {
      try {
        setQuote("");
        setQuoteLoadingError(false);
        setQuoteLoading(true);

        const response = await fetch(
          "/api/orchidbot?prompt=" + encodeURIComponent(prompt)
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
        <title>cbot web</title>
        <meta name="description" content="by RD" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        {/* <div>Enter a question and AI will generate the command.</div> */}
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
            Get Command
          </Button>
        </Form>
        <Form onSubmit={handleSubmitTwo} className={styles.inputForm}>
          <Form.Group className="mb-3" controlId="prompt-input">
            <Form.Label>Get your image prompt...</Form.Label>
            <Form.Control
              name="prompt"
              placeholder="e.g. Salvador Dali and Rene Magritte"
              maxLength={100}
            />
          </Form.Group>
          <Button type="submit" className="mb-3" disabled={quoteLoading}>
            Get prompt
          </Button>
        </Form>
        {quoteLoading && <Spinner animation="border" />}
        {quoteLoadingError && "Something went wrong, please try again."}
        {quote && <h5 className={styles.quote}>{quote}</h5>}
      </main>
    </>
  );
}
