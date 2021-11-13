import Alidns20150109, * as $Alidns20150109 from "@alicloud/alidns20150109";
import * as $OpenApi from "@alicloud/openapi-client";
import os from "os";

async function startDDNS() {
  while (true) {
    try {
      const networksObj = os.networkInterfaces();
      const wanIp = networksObj["pppoe-wan"][0].address;
      const client = Client.createClient("AccessKeyId", "AccessKeySecret");
      let describeDomainRecordInfoRequest =
        new $Alidns20150109.DescribeDomainRecordInfoRequest({
          recordId: "729721273856116736",
        });
      // 复制代码运行请自行打印 API 的返回值
      const { body } = await client.describeDomainRecordInfo(
        describeDomainRecordInfoRequest
      );
      if (body.value !== wanIp) {
        const updateDomainRecordRequest =
          new $Alidns20150109.UpdateDomainRecordRequest({
            lang: "python",
            recordId: "729721273856116736",
            RR: "inas",
            type: "A",
            value: wanIp,
          });
        await client.updateDomainRecord(updateDomainRecordRequest);
        console.log(`[INFO] Update is successfully,ip:${wanIp}.`);
      } else {
        console.log(
          "[INFO] The same records on the cloud do not need to be updated."
        );
      }
    } catch (error) {
      console.error("[ERROR] Update is failed", error);
    }
    await new Promise<void>((resolve) => {
      setTimeout(() => resolve(), 300000);
    });
  }
}

export default class Client {
  /**
   * 使用AK&SK初始化账号Client
   * @param accessKeyId
   * @param accessKeySecret
   * @return Client
   * @throws Exception
   */
  static createClient(
    accessKeyId: string,
    accessKeySecret: string
  ): Alidns20150109 {
    let config = new $OpenApi.Config({
      // 您的AccessKey ID
      accessKeyId: accessKeyId,
      // 您的AccessKey Secret
      accessKeySecret: accessKeySecret,
    });
    // 访问的域名
    config.endpoint = "alidns.cn-hangzhou.aliyuncs.com";
    return new Alidns20150109(config);
  }

  static async main(args: string[]): Promise<void> {
    await startDDNS();
  }
}

Client.main(process.argv.slice(2));
