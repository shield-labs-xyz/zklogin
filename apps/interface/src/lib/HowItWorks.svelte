<script>
  import { Ui } from "@repo/ui";
  import {
    ArrowRight,
    Lock,
    RefreshCw,
    Shield,
    UserCheck,
  } from "lucide-svelte";

  const steps = [
    {
      title: "Sign In with Google",
      description: "Start by using your Google account to authenticate.",
      icon: UserCheck,
    },
    {
      title: "Zero-Knowledge Proof Generation",
      description:
        "A proof is created to verify your Google account ownership without revealing sensitive information.",
      icon: Shield,
    },
    {
      title: "On-Chain Account Creation",
      description:
        "A secure, self-custodial account is created on the Base network, linked to your Google account.",
      icon: Lock,
    },
    {
      title: "Easy Account Recovery",
      description:
        "Recover your account by simply signing in with the same Google account on any device.",
      icon: RefreshCw,
    },
  ];

  const faqs = [
    {
      question: "What is zkLogin?",
      description:
        "zkLogin is a secure authentication method that allows you to create a blockchain account using your Google account, leveraging zero-knowledge proofs for privacy and security.",
    },
    {
      question: "How does zkLogin ensure privacy?",
      description:
        "zkLogin uses zero-knowledge proofs to verify your Google account ownership without revealing any sensitive information on-chain, maintaining your privacy.",
    },
    {
      question: "Is my Google account information stored on the blockchain?",
      description:
        "No, your Google account information is not stored on the blockchain. Only a proof of ownership is used to create and control your blockchain account.",
    },
    {
      question: "Who can control my zkLogin-created account?",
      description:
        "Only you can control your zkLogin-created account. zkLogin itself does not have any access to your Base account as it only serves as a page in your browser. There are no databases or private keys stored by zkLogin.",
    },
    {
      question: "How do I recover my account if I lose access to my device?",
      description:
        "Account recovery is as simple as signing in with the same Google account on another device. It's not possible to lose your Base account if you have access to your Google account.",
    },
    {
      question: "What is Noir and how is it used in zkLogin?",
      description:
        "Noir is a domain-specific language for writing zero-knowledge proofs. In zkLogin, it's used to generate and verify the proofs that link your Google account to your blockchain account.",
    },
  ];
</script>

<div class="container">
  <h2 class="mb-6 text-3xl font-bold">How zkLogin Works</h2>

  <div class="mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
    {#each steps as step, index}
      <Ui.Card.Root>
        <Ui.Card.Header>
          <Ui.Card.Title class="flex items-center">
            <svelte:component this={step.icon} class="mr-2" />
            Step {index + 1}
          </Ui.Card.Title>
        </Ui.Card.Header>
        <Ui.Card.Content>
          <h3 class="mb-2 font-semibold">{step.title}</h3>
          <p>{step.description}</p>
        </Ui.Card.Content>
      </Ui.Card.Root>
    {/each}
  </div>

  <Ui.Card.Root class="mb-12">
    <Ui.Card.Header>
      <Ui.Card.Title>Why Use zkLogin?</Ui.Card.Title>
      <Ui.Card.Description
        >Secure, private, and user-friendly blockchain access</Ui.Card.Description
      >
    </Ui.Card.Header>
    <Ui.Card.Content>
      <ul class="list-disc pl-6">
        <li>Create a self-custodial account easily with your Google account</li>
        <li>Maintain privacy through zero-knowledge proofs</li>
        <li>Enjoy the security of blockchain without managing complex keys</li>
        <li>Seamless integration with Base network (EVM-compatible)</li>
        <li>Simple account recovery using your Google account</li>
        <li>Full control over your account - only you can access it</li>
      </ul>
    </Ui.Card.Content>
    <Ui.Card.Footer>
      <Ui.Button variant="default" href="/">
        Try zkLogin Now
        <ArrowRight class="ml-2 h-4 w-4" />
      </Ui.Button>
    </Ui.Card.Footer>
  </Ui.Card.Root>

  <h3 class="mb-4 text-2xl font-bold">Frequently Asked Questions</h3>
  <Ui.Accordion.Root class="w-full">
    {#each faqs as faq, index}
      <Ui.Accordion.Item value={`item-${index}`}>
        <Ui.Accordion.Trigger>{faq.question}</Ui.Accordion.Trigger>
        <Ui.Accordion.Content>
          <p>{faq.description}</p>
        </Ui.Accordion.Content>
      </Ui.Accordion.Item>
    {/each}
  </Ui.Accordion.Root>
</div>
