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
      "0x0152cccce9610a0e3fa46d20240a3d20766de63831e9d40b17fb756106f5b8c70a388689dd638f8bc38a158ea14bb2bdfaf309f2a0c0c76224b4966aa069581f2735321266ed29c59084a39cec37c221ad4c03fe1acbb36ad3378804d36d5d0b100c9b903efd11f64d642cf14b25eaa01ffe9799088a44e7269a513ae9db5020129f4796aa4a924ae72e286b47420767b9149b6b04676d5f5db292bc977fbdf619d545a50a992d2a173ac48a5cff71f600e7ab17dac4aab0862b4eddd3152d2c22af9be62cc7c25ac345db9b8aa21d345d047a06ee9aa96639fdc760e7e9faff213f948c685cfccca6f928fd287791e6ab909286c23ad89653391cfcf83a09d029b8bc8a50bf2119e9c3e0dbaca9f963efe7f1f8300f9af73207357a4f5931a83016d367462f7b68146b705d1de4adad6bf0b628e1b8296f739b039d8c35ab9f2b86692784106c208880e201079c5e569abeb76d1b199e10b9d9ecf2ed020cd30c15385a974d6840f092e2a7f2f7ce75e7243d25d1d455bd31882d7eb8ba3fc00490ba55644f3155e0c28b1de1b272cf4a3bcbf32bba3d31082fcdb2c52545352ebc728efaf2f7521892445196200bd94b4bf71143ce1d92c1e321ac8b07affc16cea2cfb7e36bfd9fcf5c153a7dbad948571bb6ca0422df75c9c4be4e2641a10ac4d96b827abfdc29ce7fa5dea6a3e717c8d5552444e9a4f8411e5cf2f8c6161a3618edb4414d79c67faecac761bcfd91c7be7a67f7dad4d23181931befca24284b906c587fd32b3c423d97e042df89ef4d7d34e39a77ad8eb4ea47e681a95c1eb1dadae8fa7cb44ecd80e95a8426d35aa288fd08722e556cabd003939ba5f00865d5dac12225704e9a4878f9b38c7341d11fd52fca808772632cd54cae2d782b7a9063ff3f8d25f15afd0e4e6bb51734288c936c5f8cda72ebddfad253f6ba0e6cde57a5641a315ab8a8675a6a46ba86591c2f0f518a1d03ca5384b80c55331936c2a616e0ad99cae73ad8f10013c401cb0f8e0f81b396b20c4f76faf0054116f6c73816c659327f98caba2637bbe06e9089ddde5ac26e37db21add2226cd624f727bb897db037c4874a24cd46e8edcce516319949576c9412988451abb653081619a911dd949b3636ae7b2f737d07b931c789d13ad7ab1dd4692090f1ba00237138ad5cf44830b9849f4f6e71a2fb5da7200c94d22acb9b8958f0dfa205120f717df5c5a813c0a32072123aa574350323bf3b6f53e8cd2316f90adff9da0b06de64e51b933d58031370de048932520fccbd97cd9583a537f5d2e3dfbf3adb0c6542d545cf35575a577a2e90a142becfede22882e0a9dd16d0f7fdba46d2ea12c1f3de638ff164e29a3f964e74da1d4c04eaeec3637b5e39f1c951ed1028a522a633bb9c97a661d997772b3257503f45be8eba12dae741b71b59af8a9604422440e6ce17d6aa154724e8121d8ffaa711e147b25deeb94189fbf7570c9e99e22d56699b6c2bc88fded4d7810f2f4c063ca895f2c07f9969db158dc351df23160871e456292ba7553372e6bbf880eb85749685b6aa587fb17115d6f4aaeff6a6278f9031dc7a1f2958d417b37f2f360e8fd40587c713de646b7bb453aa64c1ed04d61c24d5180bba39237e07123fa7646cbd0bbfed1af973a8b7e5f12e2d98fd2a848291fc5bd3caf08e228d6166ee4ca6c9d7d6b5c5e0d75a7a0646a8438b5807f02d09ac9b236516ff25ccd4aa4ea9388010516239688a80a27401b55f7895284fd51dd605a855e143ddfa44a139221f6bf4fe877ae6d955f62052a8022a0d274106f4d007a370c7dc3353be9ab1564bc9ad6bab6fc4cb5658c5a648ab07c1109524df0b897d4b78799f6319eddaee91e30af3bd7a03a8c476c7d9b8d628171b69e4f732e9816102423994dbf7d724a1cbb1eda2e87c09f78dc2667d9bede52e9ff031b05801ed1bdbaf17fda5ec93abc125d56e6c9aa7e360487ff51d834823fdf9f3a854f51bb5b8bed3f88ba62553b15f895f8294e38ac346454a0d8b0f22d2fa6c5c1e72195e37ca982b8ad457caf557e3d0383e8042d9c8262aaf0c1a22b9ba1f3016f85fcb77ba8f5f67578ed0392cb8687346f0e1b95228e6d2fcaf2c5ee7643a7d528d01e348809c449f2d6bd3cedd4efdc2205f2f4ccc9c99cf9f1b54893346aa3dc9978c916e6f6927468f47d72eaef16d8a9fecf6b1fd26971d0fcae5e3befd61cf5c06978e571893d3ab83e8b1120443c18537f8085dc995931a26fafe10d27084985df1d6787dcd80a0201ce41fed094e85e8eda3bd6ffe6b098b9f198b5c771abf9208f9bd88a70744c1bd0848ae91f36e83af985294fff91babe0c345b5dd08edd14d348c23af365dab5a90c2c74c7d2f8fff2c054c994f0c0eb19f3daab2a9a252cab08f266e37448a826b84e80c828e1b8be4568b234b2abfcd042ae7904eb1887cc42e270cc5139f063122602f0d7baa43d6b2a7131825718ccca368f2f8f935ff5b2ac6fce454d8b955b2ff841da540d74f4ea7987d042c1f61fcc6e26d187b309da7eee35f1fd5dbb6438da8c04217c170a54847340a2257613df5a93e263a128c2a323f233e91e70c00b10e89e09d1c4d2e62b85e0c8c5af9ed6b72d0a57d8aac2df469750e18e4d6f359ae48acdd54cf33ae5b731082c0016e8dcbb89bfe924224d8108b03f321433c3338b6fc924cc0c3b455580ecbf84263560a030e539438a69f96d1901c5b88238aface9da90c66660116ca21405f3f5edbca74b6b19f699dcbe4434337ac6354eb959db8af69a12677a53f2ae52349b633af146e3b54318067b574e1f4a9b539fda3d9c9e9f22b17051dbe0778bbef3fb75eb3b1a316bb415bf714666f5ec73e3bdfd59028bda85e61452420d97b658e07e5acfdeb89ef098d80f4f5b73b40d96a741a2dbe8dd9bd2e12e10269412ffe87bfd19323d2cab6f3f9035489e000891f9ccb6f1e5a453fce260622aba95d7dc45f46b48fdc233459f455c0b0277fefc89229bd4b21faa1df03dd";
    const publicKey = {
      public_key_limbs: [
        "0x9d9b7ab520532396758488b2100155",
        "0x87ff0f733247ea1ae377d26bdd60aa",
        "0x55e1805ec2babe74ebadb5de3c29a7",
        "0x4131e289b5519e562dff8935a669e2",
        "0xe974f2f0179abc0cc837efb26a9d5d",
        "0x72f158dfb2a2ba0fd881d8742426ec",
        "0x7e56e9182ef83caea0a45cfdaba45a",
        "0xc2b9b23f6684f0442257dbb8a37291",
        "0xfc0ecae4fe9f8be5c52a91edd59db2",
        "0x3ba9bd0376ade89881c7bafa2b36de",
        "0x3548bec7032b97739300f7fd72769b",
        "0x6a5b4b975ccf938c5e63ee41d57c7c",
        "0x4fabc9dbb6a9157f91a87adaff6e66",
        "0x303d705edf9cae022cd91f57f332b6",
        "0x1834cc2b65d9d2cab6dd210ba58cad",
        "0x43b9c3ca0df606d243d4c442794829",
        "0x5239e9f174adc5871d580714b1eb98",
        "0xe1",
      ],
      public_key_redc_limbs: [
        "0x1e7578875458139006e47aac5c17fb",
        "0x249a5affa65fe288cb0df8ab6548be",
        "0xc29ec9b115f3132ff5fb71e744fba3",
        "0xbde4d1e1b2e894dd482277dc14aba5",
        "0x675f382edc2e53fabb2c785f0dd7e8",
        "0x8af86434e50f50ddfc9b46ce2c8990",
        "0xbaf8f36a4caec8a61d14be456599d3",
        "0x4ac14c9865afb8da5ab36b76e6d651",
        "0x2be72e03504024bbc777e0a1e9d16d",
        "0x249a0c4d673705ab5ad1757a225fea",
        "0x0300712f5005899fffeb1289f9ef4b",
        "0x73eb759f585e597acb40bfbf59efed",
        "0xe070a169f35358c7ead1df56d02d4b",
        "0x5657e0c005b6bca107abd9024b4dd1",
        "0xe6da2103c7938911ca44a5e641c541",
        "0xc98e9e1235394e0eb2b87143fd42c3",
        "0xdb1c76abaf095069edf0ea5248ef95",
        "0x0122",
      ],
    };
    const accountId =
      "0x0ec327b01716a7ccc9339270ef9d1eed3c618b1a5b4720a2a3e0bd785ab45911";
    const jwtIat = 1729206450;
    const jwtAud =
      "698109474805-nvfg9hh31kjmb6mmn51d4oiombgr3s3v.apps.googleusercontent.com".padEnd(
        256,
        String.fromCharCode(0),
      );
    const jwtNonce = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045".toLowerCase();

    await publicKeyRegistry.setPublicKeyValid(
      authProviderId,
      await publicKeyRegistry.getPublicKeyHash(
        publicKey.public_key_limbs,
        publicKey.public_key_redc_limbs,
      ),
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
      publicKeyLimbs: publicKey.public_key_limbs,
      publicKeyRedcLimbs: publicKey.public_key_redc_limbs,
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
