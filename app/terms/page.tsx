import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: '이용약관 | 서풍몰',
  description: '영어조합법인 서풍 쇼핑몰 이용약관',
};

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-16 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">이용약관</h1>
        <p className="mb-8 text-sm text-gray-600">
          본 약관은 영어조합법인 서풍(이하 &quot;회사&quot;)이 운영하는 쇼핑몰
          shop.seopung.co.kr(이하 &quot;몰&quot;)에서 제공하는 인터넷 관련 서비스의 이용과
          관련하여 회사와 이용자의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
        </p>

        <div className="space-y-6">
          {/* 1. 목적 */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">제1조 (목적)</h2>
            <div className="space-y-3 text-sm leading-relaxed text-gray-600">
              <p>
                이 약관은 영어조합법인 서풍이 운영하는 온라인 쇼핑몰(이하 &quot;몰&quot;)에서
                제공하는 인터넷 관련 서비스(이하 &quot;서비스&quot;)를 이용함에 있어 회사와
                이용자의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.
              </p>
            </div>
          </section>

          {/* 2. 용어의 정의 */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">제2조 (용어의 정의)</h2>
            <div className="space-y-3 text-sm leading-relaxed text-gray-600">
              <ul className="ml-4 list-disc space-y-2">
                <li>
                  <span className="font-medium text-ocean-500">&quot;몰&quot;</span>이란
                  영어조합법인 서풍이 재화 또는 용역을 이용자에게 제공하기 위하여 컴퓨터 등
                  정보통신설비를 이용하여 재화 또는 용역을 거래할 수 있도록 설정한 가상의
                  영업장(shop.seopung.co.kr)을 말합니다.
                </li>
                <li>
                  <span className="font-medium text-ocean-500">&quot;이용자&quot;</span>란
                  &quot;몰&quot;에 접속하여 이 약관에 따라 &quot;몰&quot;이 제공하는 서비스를
                  받는 회원 및 비회원을 말합니다.
                </li>
                <li>
                  <span className="font-medium text-ocean-500">&quot;회원&quot;</span>이란
                  &quot;몰&quot;에 개인정보를 제공하여 회원등록을 한 자로서, &quot;몰&quot;의
                  정보를 지속적으로 제공받으며 &quot;몰&quot;이 제공하는 서비스를 계속적으로
                  이용할 수 있는 자를 말합니다.
                </li>
                <li>
                  <span className="font-medium text-ocean-500">&quot;비회원&quot;</span>이란
                  회원에 가입하지 않고 &quot;몰&quot;이 제공하는 서비스를 이용하는 자를
                  말합니다.
                </li>
              </ul>
            </div>
          </section>

          {/* 3. 서비스 이용 */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">제3조 (서비스 이용)</h2>
            <div className="space-y-3 text-sm leading-relaxed text-gray-600">
              <ul className="ml-4 list-disc space-y-2">
                <li>
                  회사는 다음과 같은 업무를 수행합니다: 수산물 및 관련 상품에 대한 정보 제공 및
                  구매계약의 체결, 구매계약이 체결된 상품의 배송, 기타 회사가 정하는 업무
                </li>
                <li>
                  회사는 상품의 품절 또는 기술적 사양의 변경 등의 경우에는 장차 체결되는 계약에
                  의해 제공할 상품의 내용을 변경할 수 있습니다.
                </li>
                <li>
                  서비스는 연중무휴, 1일 24시간 제공함을 원칙으로 합니다. 다만 시스템 점검 등의
                  필요가 있는 경우 서비스가 일시 중단될 수 있습니다.
                </li>
              </ul>
            </div>
          </section>

          {/* 4. 회원가입 및 관리 */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              제4조 (회원가입 및 관리)
            </h2>
            <div className="space-y-3 text-sm leading-relaxed text-gray-600">
              <p>
                이용자는 &quot;몰&quot;이 정한 가입 양식에 따라 회원정보를 기입한 후 이 약관에
                동의한다는 의사표시를 함으로써 회원가입을 신청합니다.
              </p>
              <p>회사는 다음 각 호에 해당하는 신청에 대하여는 승인을 하지 않을 수 있습니다.</p>
              <ul className="ml-4 list-disc space-y-1">
                <li>가입 신청자가 이 약관에 의하여 이전에 회원자격을 상실한 적이 있는 경우</li>
                <li>등록 내용에 허위, 기재누락, 오기가 있는 경우</li>
                <li>기타 회원으로 등록하는 것이 회사의 기술상 현저히 지장이 있다고 판단되는 경우</li>
              </ul>
              <p>
                회원은 회원가입 시 등록한 사항에 변경이 있는 경우, 즉시 전자우편 기타 방법으로
                회사에 그 변경사항을 알려야 합니다.
              </p>
            </div>
          </section>

          {/* 5. 상품 주문 및 결제 */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              제5조 (상품 주문 및 결제)
            </h2>
            <div className="space-y-3 text-sm leading-relaxed text-gray-600">
              <p>이용자는 &quot;몰&quot;에서 다음의 방법으로 구매를 신청합니다.</p>
              <ul className="ml-4 list-disc space-y-2">
                <li>상품 검색 및 선택</li>
                <li>수령인의 성명, 주소, 전화번호 입력</li>
                <li>약관내용, 배송비, 환불조건 등에 대한 확인</li>
                <li>결제방법 선택 및 결제</li>
              </ul>
              <p>결제 방법은 다음과 같습니다.</p>
              <ul className="ml-4 list-disc space-y-1">
                <li>계좌이체</li>
                <li>신용카드 결제</li>
                <li>무통장입금</li>
                <li>기타 회사가 인정하는 결제수단</li>
              </ul>
            </div>
          </section>

          {/* 6. 배송 */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">제6조 (배송)</h2>
            <div className="space-y-3 text-sm leading-relaxed text-gray-600">
              <ul className="ml-4 list-disc space-y-2">
                <li>
                  회사는 이용자의 주문일로부터 7일 이내에 상품을 배송합니다. 다만, 수산물
                  특성상 기상 상황 등에 따라 배송이 지연될 수 있으며, 이 경우 사전에
                  안내합니다.
                </li>
                <li>
                  배송비는 회사가 부담하는 것을 원칙으로 하나, 일정 금액 이하 주문 시 별도의
                  배송비가 부과될 수 있습니다.
                </li>
                <li>
                  수산물은 냉장/냉동 배송을 원칙으로 하며, 신선도 유지를 위해 도서산간 지역은
                  배송이 제한될 수 있습니다.
                </li>
                <li>
                  배송 중 발생한 상품 파손 또는 변질에 대해서는 회사가 전적으로 책임지며, 교환
                  또는 환불 처리합니다.
                </li>
              </ul>
            </div>
          </section>

          {/* 7. 교환 및 반품 */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">제7조 (교환 및 반품)</h2>
            <div className="space-y-3 text-sm leading-relaxed text-gray-600">
              <p>
                이용자는 상품 수령일로부터{' '}
                <span className="font-medium text-ocean-500">7일 이내</span>에 교환 및 반품을
                신청할 수 있습니다.
              </p>
              <div>
                <h3 className="mb-2 font-medium text-gray-900">교환/반품이 가능한 경우</h3>
                <ul className="ml-4 list-disc space-y-1">
                  <li>배송된 상품이 주문 내용과 다른 경우</li>
                  <li>상품이 파손되거나 변질된 경우</li>
                  <li>상품의 품질에 하자가 있는 경우</li>
                </ul>
              </div>
              <div>
                <h3 className="mb-2 font-medium text-gray-900">교환/반품이 불가능한 경우</h3>
                <ul className="ml-4 list-disc space-y-1">
                  <li>이용자의 귀책사유로 상품이 멸실 또는 훼손된 경우</li>
                  <li>포장을 개봉하여 사용하였거나 일부 소비한 경우</li>
                  <li>수산물의 특성상 단순 변심에 의한 반품 (냉장/냉동 상품)</li>
                  <li>시간 경과로 상품의 가치가 현저히 감소한 경우</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 8. 환불 */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">제8조 (환불)</h2>
            <div className="space-y-3 text-sm leading-relaxed text-gray-600">
              <ul className="ml-4 list-disc space-y-2">
                <li>
                  회사는 이용자가 구매 신청을 철회한 날로부터{' '}
                  <span className="font-medium text-ocean-500">3영업일 이내</span>에 이미
                  지급받은 대금을 환급합니다.
                </li>
                <li>
                  환불은 원래의 결제수단으로 진행되며, 결제수단에 따라 환불 소요 기간이 상이할
                  수 있습니다.
                </li>
                <li>
                  회사의 귀책사유로 인한 반품의 경우, 반품 배송비는 회사가 부담합니다.
                </li>
                <li>
                  이용자의 단순 변심으로 인한 교환/반품이 가능한 상품의 경우, 반품 배송비는
                  이용자가 부담합니다.
                </li>
              </ul>
            </div>
          </section>

          {/* 9. 면책조항 */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">제9조 (면책조항)</h2>
            <div className="space-y-3 text-sm leading-relaxed text-gray-600">
              <ul className="ml-4 list-disc space-y-2">
                <li>
                  회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는
                  경우에는 서비스 제공에 관한 책임이 면제됩니다.
                </li>
                <li>
                  회사는 이용자의 귀책사유로 인한 서비스 이용의 장애에 대하여 책임을 지지
                  않습니다.
                </li>
                <li>
                  회사는 이용자가 서비스를 이용하여 기대하는 수익을 상실한 것이나 서비스를
                  통하여 얻은 자료로 인한 손해에 관하여 책임을 지지 않습니다.
                </li>
                <li>
                  회사는 이용자 상호간 또는 이용자와 제3자 간에 서비스를 매개로 하여 발생한
                  분쟁에 대해 개입할 의무가 없으며, 이로 인한 손해를 배상할 책임이 없습니다.
                </li>
              </ul>
            </div>
          </section>

          {/* 10. 분쟁해결 */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">제10조 (분쟁해결)</h2>
            <div className="space-y-3 text-sm leading-relaxed text-gray-600">
              <ul className="ml-4 list-disc space-y-2">
                <li>
                  회사는 이용자가 제기하는 정당한 의견이나 불만을 반영하고 그 피해를 보상처리
                  하기 위하여 피해보상처리기구를 설치·운영합니다.
                </li>
                <li>
                  회사와 이용자 간에 발생한 전자상거래 분쟁에 관하여는 이용자의 피해구제신청에
                  따라 공정거래위원회 또는 시·도지사가 의뢰하는 분쟁조정기관의 조정에 따를 수
                  있습니다.
                </li>
                <li>
                  이 약관에서 정하지 아니한 사항과 이 약관의 해석에 관하여는 전자상거래 등에서의
                  소비자보호에 관한 법률, 약관의 규제 등에 관한 법률, 공정거래위원회가 정하는
                  전자상거래 등에서의 소비자 보호지침 및 관계법령에 따릅니다.
                </li>
                <li>
                  이 약관에 관한 분쟁은 <span className="font-medium text-ocean-500">대한민국 법</span>을
                  준거법으로 하며, 회사의 소재지를 관할하는 법원을 전속적 합의관할법원으로
                  합니다.
                </li>
              </ul>
            </div>
          </section>
        </div>

        <div className="mt-8 rounded-xl bg-gray-50 p-4 text-sm text-gray-500">
          <p className="font-medium text-gray-700">사업자 정보</p>
          <p className="mt-1">
            영어조합법인 서풍 | 대표: 김태환 | 사업자번호: 417-81-41979
          </p>
          <p>주소: 전라남도 여수시 석교로 121</p>
        </div>

        <div className="mt-4 text-right text-sm text-gray-400">
          <p>시행일: 2026년 3월 25일</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
