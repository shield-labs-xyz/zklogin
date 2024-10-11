<script lang="ts">
  import LoadingButton from "../LoadingButton.svelte";
  import { toast as toast_, type Toast } from "./toast";

  export let toast: Toast<{
    confirmText: string;
    onresult: (result: boolean) => void;
    yes?: string;
    no?: string;
  }>;
  $: ({ onresult, confirmText, yes = "Confirm", no = "Cancel" } = toast.props);
</script>

<div>
  <p>{confirmText}</p>

  <div>
    <LoadingButton
      onclick={async () => {
        toast_.dismiss(toast.id);
        onresult(false);
      }}
    >
      {no}
    </LoadingButton>

    <LoadingButton
      variant="default"
      onclick={async () => {
        toast_.dismiss(toast.id);
        onresult(true);
      }}
    >
      {yes}
    </LoadingButton>
  </div>
</div>
