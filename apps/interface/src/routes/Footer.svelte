<script>
  import { Ui } from "@repo/ui";
  import { Github } from "lucide-svelte";
</script>

<footer class="mt-12 bg-gray-100 py-8">
  <div class="container mx-auto px-4">
    <div class="flex flex-col items-center justify-between md:flex-row">
      <div class="mb-4 md:mb-0">
        <p class="text-sm text-gray-600">
          Created by <a
            href="https://shield-labs.xyz"
            target="_blank"
            rel="noopener noreferrer"
            class="font-semibold hover:underline">Shield Labs</a
          >
        </p>
        <p>
          <a
            href="/privacy"
            class="text-sm text-gray-600 hover:underline"
            rel="noopener noreferrer"
          >
            Privacy Policy
          </a>
        </p>
      </div>
      <div class="mb-4 md:mb-0">
        <p class="text-sm text-gray-600">
          Supported by <a
            href="https://shieldswap.org"
            target="_blank"
            rel="noopener noreferrer"
            class="font-semibold hover:underline">shieldswap.org</a
          >
        </p>
      </div>
      <div class="flex space-x-4">
        <Ui.Button variant="ghost" size="icon">
          <a
            href="https://github.com/shield-labs-xyz/zklogin"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <Github class="h-5 w-5" />
          </a>
        </Ui.Button>
      </div>
    </div>
  </div>
</footer>
