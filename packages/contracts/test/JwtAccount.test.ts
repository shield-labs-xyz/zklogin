import { type SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { ethers, safeGetNamedAccounts, typedDeployments } from "hardhat";
import { describe } from "mocha";
import { snapshottedBeforeEach } from "../shared/utils";
import {
  PublicKeyRegistry,
  PublicKeyRegistry__factory,
  SimpleAccountFactory__factory,
  TestJwtAccount__factory,
  UltraVerifier__factory,
} from "../typechain-types";

describe.skip("JwtAccount", () => {
  let alice: SignerWithAddress;
  let deployer: SignerWithAddress;
  let publicKeyRegistry: PublicKeyRegistry;
  const authProviderId = ethers.id("accounts.google.com"); // TODO: think about the structure

  snapshottedBeforeEach(async () => {
    deployer = await ethers.getSigner(
      (await safeGetNamedAccounts({ deployer: true })).deployer,
    );
    await ethers.provider.send("hardhat_setBalance", [
      deployer.address,
      ethers.toQuantity(ethers.parseEther("100")),
    ]);
    await typedDeployments.fixture();

    [alice] = await ethers.getSigners();

    publicKeyRegistry = PublicKeyRegistry__factory.connect(
      (await typedDeployments.get("PublicKeyRegistry")).address,
      deployer,
    );
  });

  it("works", async () => {
    const verifier = await new UltraVerifier__factory(alice).deploy();
    // run `pnpm test:unit` in apps/interface to get the proof and public inputs
    const proof =
      "0x23b8d58015841c5d5abfd187f1418aa518b383c74e84a4493e0dbd0886922b4b0abca19d71aeea5365d00cab032880965808dc6aa9242150a78d3dd5594f56e025a69f6c32e087e9a69a7fdbdea69801ccb8774fbc8b50cdfdf6e8f73acb634903705a8473abc6ceb49810007f1dcc6557f559bf1ed18010b4cb474e304580a70247527c4eca321cd98d6b5eeb485d3f19abfb8c6871ab831129c0701cd9c38419df2b644928ea94922bf8f08f82ee43743541e642c3829102b40ba256433ef122956d2c0072eba2b4f6e0d5f3a4648124080ed28a1dea617a8463d956a7310f15faeb0f62e7c6c08650f2f8af0289142869289cda9c7b77d34c8afa05fa24bf1660669556bcf372761e648255b3309cc83eb8abe9da655045426bea4a61141e197976e76936ff3e2efc5a6635dc795316530c3a0e4dbbf10143207ea5a6482704abdd561e035bc5a32b535df4d37469ecec20d3b5e8d0958f49fc2b0acde15e25220b072ab8df486b5e73a199ed25529858f529bfa20daf36bceb6523d0cf9a1058d7889e03685298cc742b83cc86ab4ea7e586ad2a2d064e2e6b1812e6877f2d92968bdfa71bbf1509ac7fe978a31f806441c3bde744dbd613de46659d36cf1103482570b9abc468210491e9572d45f7f987d42caf9f152fd43186b81a1c751467f382c7543e20a19d18b222cd3f08a51cc228a821a8c617574ec86eeb4a030424158bed62eb76702601206532c83830345aed0547fecf816fbd5bf409eb3a1463bf4176a27b66e0a9bf741a627278f5f53a2cac49f6c2e973e1d4700a387e0e354f37eb0362836ff4efb8c2aa68a8d67fb594ae6b4d9ad3562efd598b42660d70959cd5aa21ca6f7d808b308c3d98beb3adf3f564a114fd35cd792954418b2a1dae6e18a1fe1263f3d192692a4ae994cd745bcd597dd6c7d06e4c35a0e82e18c6d1a26749fae4c3f708058c567b9fa97b605f41c433a0e26b0e59549cc307236c376a0558dc9ee659b6fc7e0667e108447833560e5297e46e3703f5cef517113a63ea98385cc0376793eea201e074d1f396f124f69f161ace7890d5ed39df1326d2f3773cf4c12bd8d9d8cf55f2b70e192b9dfb75db033e048b88ca8fdd210cee7dce06dbaa6640694a7f18368f55b28e0de82d24d18490f5202506669e211316f8c9738db3362bfa98f7c20440945b630d0195e0cb8dfef8073fcf061d58217f69151eb73f8295eb5cbe8f30cbd451a4a88d1378b9ccbb12f8d44b8d5afa1db946d700010918d050e4fd588890e9b5287945a40c32ba03088ffb510967f4244b75f00b36627b2be0048a56744b7182329fb6cbe9d40804edaa0f47902bb402a9aa4a247decba0da440f1c4a74b530406cb7504a4d9802c122508ef7889f01a219e8da1f07877b1bdf459c779fd04bcb965f5064fe5af44a17fc2be4794b70c1e9d76df5ababcb4a2e2184032bd3b849943c6b1c995dccc351dce96502789211dcdd9294a49bb63fc2adc4463c351ef5b8d23e6af8becb0b3536164812247185c274c92bb65d942bea415ccf3b34e2cf0f6375504bbc659a1b072becd9d6d1b8c8429275d2d4138f9103cb021182ee206e9a084efde76bf552f637dce2c1b1d77bc57d9e557276544ad9f5bc22aa8a05d73895f6b5b4f9f72fdbba0b9c7d12a131b140b8595cca307141e659c03cf00044cfe1607d99247b57e27dc610576287633993e69a0bab0e6cbfb5e978912b976ba74b8dda44762732488b273e3f31e75fb13e390ff405ca43896522cb6580be1c3af53c141d2d1212eb70c6ad9380fe256f28dd0b5a1ccf4c5e13510382b9f67c7a3196145c94590c9b723de4d8d28cd8aa7b39da3a6bf6a2933b91d0ddacd7b25023bfac3b356a842d1b1171a1426ad43a94e5664ea2b9262dfc53512c8e40ceebb58ba3c720004a29b77176e00258ad89b3dd0279d5f3968f926702dcd88662c77d9d5b9247c388dc896fc2d240363c375f59e78b4d98c92ae6011fd39e13ac475a372e448ae6ecd339899613f0bb401425c71ea0bd27a6b6cb94102452f6c6a797173f5e1f92036fc9c4a966c0f9f7931165c3da148b8604db131d1b7095a7d72d7fd8665cf8fcf4020e1cc580a010b0015472bb132b01999fb716b5b937c39138d0d7aa839554b32343190542d9677a2059c1e98cc38e245c16aa9a5e25b16eb9a129747cea33872b19424f60cdd6ddfd7fc26be686f53593491b49b40bad44c6975876129230026c774816d0a5d270c65db153b649e277928640cba9134857e9a5a456b49503b1970b1a7be056c9c571b28ee0ceea23c6839b8121979c59fb263b86846b543ee6063e1dac0047ebacb5ca22dde254e603b3cd4754a53cc43e75060c603ad6d49b9c32bf49a07f7b8dd2552fbd45bef258a9b0f2cf09e2d8c506835df6152c2c9d093cf349d2e3e55f16f291475375a4e71de366b311008748ef193d64fa9f334e4931777b222c95c5ece189a328d03420c24433b44f87de6e4a2f413c1ec7407ef25137df91ac30e4627699f67d8868c8dc9e1a7b8c663f6804256f7ac3ca3c1cd61b1a3dd1da89e3d0aa9dea5d4ca08b4b3920e51c245873fbf581726351fe3cfded80b7503d2a1f41f9021e9cb7061e15f94e21f38621dad48ffab9710523abb490c5ad20e6a1c588df18b9dc692dafe5f669a714890412cc4722b84102ca23b2f5b681f1de040b68fef69c5ece7cb03e74515cf326ea5b29bdc7ddf9511541fe09a1e5220ebd103cb47fac9e118acdd91b21c20205800d94203831b7000db1fecc85fd716488f06c9199f6b3fbf1b86f02abca860b669591ab7aeb5d4750386e07c8b9927d44490c56298d753d5d3735ea93dc06e02a232af742dd33a92e167c65aea6d1bb41d250dec47b4fc568b27cad97c8ee09fbf16a99342d78c9d7ff0cb128c8024f3d174179b7c29299e41b96ebc4d67829d8ab795d8a4680025f417cfe9d50919221cc39bbd5b93a068980e135838db834863934cf2aef2a208428219c3049a";
    const publicKey = {
      public_key_limbs: [
        "0x3b64813eec8dd53596f86c31ae19d3",
        "0x689f8037a24e75e9658f327d54c225",
        "0x3dd0b36d61a49f40f987ec7e6364c6",
        "0xaee2ad8cedaa2c229fa69bc6bf511e",
        "0xd3e4cf181fd1e48e5850efe7fd7d60",
        "0xff3aab1126ad830bb15377fff79634",
        "0xa8d7d7d69100b104414fb2fb08bda6",
        "0x6d5f59c1d8c5b532fc21c30b709ddb",
        "0xa0eb674957342d5e083589a682739c",
        "0xb39164e956cc1c8e9f9a86b0cbc8dd",
        "0x76caf4eccde5b21bce36d2bf1ac833",
        "0xe27c23ce5cac82e8de1fba34f72567",
        "0x6c853cdb640e3849a835ba4c7cb4ea",
        "0x642cb63a5eb5380da9508a3ae53acc",
        "0x912cd4b0e3843009aba73e4a838379",
        "0xaa46cb09f4c7d7c76c3fe67e0b4519",
        "0xc5db9b0ef110354b2e4009771a48fb",
        "0xb4",
      ],
      public_key_redc_limbs: [
        "0xa4b79dc7aa82e11dd4f2cdd5d7aafe",
        "0xc4b2f5afa03ef0f6aa6e8c0295c8b8",
        "0x8a3d9b48dc105a08a172f6cbb6d1",
        "0xe8e7baf3e34d6c210e31cde9e7ad91",
        "0x9a23ade32b08b760009c3172794d60",
        "0xa3a4c02f121166a4cbf22b316e251c",
        "0x085fad7386f2c6ff8d1d26ce1116dd",
        "0xa6556b550bcc82c11ce6925708df50",
        "0x5111678268e53dfcd6803453a3213b",
        "0x3c4f5acf2737253cb38343e5765d5f",
        "0xb85e2fa780802e6938f2670d2fa3b3",
        "0xac8b190844fcefa0cec58ce8fcf3ef",
        "0xbde8982fb2e6d713c2f91555249a6c",
        "0xf2d90755a20cd6679b43f72534f6ec",
        "0x10619a0c765e202b72d8b26052067d",
        "0x7f270e4a4c6a3ee62885f8d2b2ab5e",
        "0x8841a409e43e3d4f209acd805f8778",
        "0x016a",
      ],
      // aztec.tools/pedersen. Put concatenated limbs and redc_limbs
      public_key_hash:
        "0x1b00b0954712c1b650fa67c0380793509b9bbfe854392f1a0c19da69a7a3da50",
    };
    const accountId =
      "0x10b1c26132c4ec6c5071163cf1b59b6eb36d451c732a279cf6d6a6c1d3aef956";
    const jwtIat = 1729299960;
    const jwtAud =
      "698109474805-nvfg9hh31kjmb6mmn51d4oiombgr3s3v.apps.googleusercontent.com".padEnd(
        256,
        String.fromCharCode(0),
      );
    const jwtNonce = "0xd4dad8b15aeffdc0cabb1ef7ff6c895dcedc0cb0".toLowerCase();

    await publicKeyRegistry.setPublicKeyValid(
      authProviderId,
      publicKey.public_key_hash,
      true,
    );

    const account = await new TestJwtAccount__factory(alice).deploy(
      accountId,
      authProviderId,
      verifier,
      publicKeyRegistry,
    );

    const tx = await account.verify({
      proof,
      jwtIat,
      jwtNonce,
      publicKeyHash: publicKey.public_key_hash,
    });
    const receipt = await tx.wait();
    console.log("gas used", receipt?.gasUsed);
  });

  it("deploys using factory", async () => {
    const factory = SimpleAccountFactory__factory.connect(
      (await typedDeployments.get("SimpleAccountFactory")).address,
      alice,
    );

    const account = await factory.createAccount({
      accountId:
        "0x0ec327b01716a7ccc9339270ef9d1eed3c618b1a5b4720a2a3e0bd785ab45911",
      authProviderId,
    });

    const receipt = await account.wait();
    console.log("account", receipt?.gasUsed);
  });
});
