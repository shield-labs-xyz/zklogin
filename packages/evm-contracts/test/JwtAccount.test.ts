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

describe("JwtAccount", () => {
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
    const proof =
      "0x2a43443fa1604a82f2d1bdfb1300c073f961adda4affc9260688ee64ee0b50c22f7be9ffbc2b1607ca3954806ee02719e5238b6202660fff45455ef1d75411192df03e231475cf80c7e25ccf4094ebe8e1bd817ec67b6d635624be82890b3b1f14874a61cc53832346d5f1ce50d43747a0ce4abf210d569ee2fa1e0d7426ecc6103fbef85cafe765461b2dad875a06926c905dbb4f6aed091156e038a915fb3f23ca187701981845e76f3c7cc236be46cab4b606ed1ff2be3af0d8327713a57200d514aed02302f0c60e955547fd439ae6cf76b6b830af57e079c0515aa345eb1bafb44147bf7f77741b6be919ec3d1b591c376a3a98c9ae05dc5cb952caa72309575023e0742306b3f1e8bcbfeb2bcd63b98959dd879ed29097eb1eb83c9cb424b01cecc55f03ad0d2e8eed519774cefe3032afb070e7717f8a218f7df83d4f0895bfaac625a9c10a8dc036049671386444f47ae63f8f0722993523708798b13039861ea501b43b8da50c76bf8f5f0a37286c2b3d9d2f4420c12221e7012fe60d7f89bbdb915fe23c1d1393d89ece5b680526a25d34a0384420fbbc5444f861067f3fcb0c59f6d2cc6aa5d1d1ae9b5d92208b8e1f2a25c7a2f1afe7c141d2662769884d46fa892df5838ad4e1fd3e34b129cefa87f1d8a2e9047700c5400ffb1fbf207bbf3479fd9562b85309d8d66babb292e416babed55d745adda402f38f1f7cac2d2a079b6ac34ead1310da779780b1a6b5a0ddeb707c62e78ecf751ef11575cf0405d7359df8f8ca2f76737ad2aab9fa45f51b717da1b765abe12204fa1f1c734440057d24497672c1cb979dc0dbbbd5d0306f220e850b1378047f6a5100116d0805a1b3060dcd46320a33ff5119fa983d85debf944d5a5987903bbda003c27bb97034cdd127212cad10ab617b873be00744f2ca22e45ea69f0d394003221bf07369c94be667e9e0f14033ee7febff245e773e4ead1636b6225ad76e1d0f38907ad459afd45e0cde001a79e94a0c7a6ec82e7621a281b899f83224059800a7e3009d446a830fd05ed6d728303788e08e1c9e47d82163fe6704adea7d0012a6654d0fa917ebcf698a2ab92616775c1725d24429c76f7eabda3ac437bb6222496df1de098eb3167542dc3798db82cec9195fa75e54ea37be8b02d13240870af53bbe40848ed3656f2c78a8bc7d00fee22b13dbb5efc1e24eb499961258aa2a3fab683b0285fba92d6c6a7897601e4e6b3b22e1214f7e7539a223e52e179d24e5d65717f01b523ec1d73ec20e5098f776ff3228ff12f22e67ac09355e74af209d13f02e2aeee55571645bdbe5b535cab1182b95111b2bcb0bb32592cc234a2e8cd1d334c4dd7e7d2f1982f55141478b2b4539ba820c97c3b10aecdf8f2d3f10cccbf20a6267c364d748352c7545963be15fc3675bc4cab69249438e642d2d1913bd6741869cdb50e30cfa46a2ea699ae02c16ced807b0d3792153dd47552f230d33512f945e1abd2f3268875763a13d048e2224e498091d64a00640fcd10311cc8aaed3c6a7af130f19a3019587c86215594307605ef2e621fb33697ca04d25fbfee61f831c6d78cd3127c2fab7535ff0bf1337269b97784d87f2c7e4c91a23e1f9ce4b13c95be465fa58d7a44053133ad38432d6b302a01d63bfebd690bd047c9475da25e1e42e416ece88db0222524b35eba2d9c819e4b8c1993d7641a9248d554cd1b51c0fbe32a8acb5625a13dcae23b54eaf94cf2da110d689df0e6c071c2d3a772fad20f85592ac9f63314d46dae29c5c33262f50ee37c0c4c60e7421c912bf1b7a2d14a061eff857c6fdf75b55e8f699a2299bd7327b34127e65a622d1caa03d2edf05fa3d8d33942b20ca77d1bda2d5665656fe831009231cde18150116c66946e79fe8bdc0e828d57485e5402ff88e54e559b63a6cab03fee8be0a05612096b2655d6d921fb7e77035f0617820c06e101c32b12034a4387a47ee2aa8b0c1c92e31b98284bae06e20e8af2cf2000129c2b8f06de1604f6dd659da253f8bcdbec18ca27bd37e66e76ce6f450fe5ccfaebb0ffec89d207f47fe8552297b34c01dc7407047a1a917075a4cb3b550cd4c7996b306043329325f93f3e524f0f26ebd7b52a9fd53bf7c869c969ad43882b9793f10e8abfd97be229998c91a7de0d2127982011b191886f31442e2ef852e7f5b530b4118d423829c0f35692705b410ce3d0e683c0930679859cb0e53b4c72a94ca200774ef013ec3dd7dcd0f5f3be822dcc964d2161d648c86bfaf7ed7b2a95ae8532bc3506eb8f5a75419023dfb29193d7edd5d5a631cd0ec78ba764b7a52e4d8859b301fd4089c11a80025d861e2a83691f5ee842e6eb755ed3f03bb61a209cf041d96a2ea1e2c104b7c2e925bd36637c6bcfe291fbc89919144d757dab535909ce6ad72541570a3137208bcc1bf82d658eb9301c1d360c41fe20d7bfb3b4199d01f4042f56970a220fa0501f3666ff17493a33af45004502238ac0604bc6ed5e0144678b8d646212c492e72d68358bb7fc43ce702ac0e06970530ce59f60278d320186a0c8f5b7780941dcdc9976e122818fd3708e618ddac17cf655b804cbdc174c4c94b74e42eb178018a48e5f9a175e66ef44ee62337bfe5c5b4f664a9dc24785eb7e079c44d58f42b5273a8e2cff05cfb59617a8a075108637439754bccdb7c0ed00996f4d455fb1f82e873aa8782351d42756ca97047639efbf831d8cf08e2fea175f844bbb028002e6bf4daf44eb00fd28808500823c3df11b12fbd3807a32652f3803061809d133fead9e1da2469ebc4dc93b8740894719c5fdaba18f796e5970b4d0642b033111e1cc7c8e961c0744a15a75900eccecdd0161f0311c45fdf6be813bec7bc2410eadd7c05caeba4e7637ff6b1b685a74ae96d9493461fb6095981e7c8a6eb73076064f4211754dfaf5a281e161ffb08be34d1c8bfd03297b5d25dfdd28cf98225783c1fbb2e133e82273e81f770fee287c6eb5da5328929de6dc57edd5556e9";
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
      "0x0ec327b01716a7ccc9339270ef9d1eed3c618b1a5b4720a2a3e0bd785ab45911";
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
      jwtAud,
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
      jwtAud: ethers.toUtf8String(
        Uint8Array.from([
          54, 57, 56, 49, 48, 57, 52, 55, 52, 56, 48, 53, 45, 110, 118, 102,
          103, 57, 104, 104, 51, 49, 107, 106, 109, 98, 54, 109, 109, 110, 53,
          49, 100, 52, 111, 105, 111, 109, 98, 103, 114, 51, 115, 51, 118, 46,
          97, 112, 112, 115, 46, 103, 111, 111, 103, 108, 101, 117, 115, 101,
          114, 99, 111, 110, 116, 101, 110, 116, 46, 99, 111, 109, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        ]),
      ),
      authProviderId,
    });

    const receipt = await account.wait();
    console.log("account", receipt?.gasUsed);
  });
});
