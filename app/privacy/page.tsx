import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: '개인정보처리방침 | 서풍몰',
  description: '영어조합법인 서풍 개인정보처리방침',
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-16 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">개인정보처리방침</h1>
        <p className="mb-8 text-sm text-gray-600">
          영어조합법인 서풍(이하 &quot;회사&quot;)은 개인정보보호법 등 관련 법령에 따라 이용자의
          개인정보를 보호하고, 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여
          다음과 같이 개인정보처리방침을 수립·공개합니다.
        </p>

        <div className="space-y-6">
          {/* 1. 개인정보의 수집 및 이용 목적 */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              1. 개인정보의 수집 및 이용 목적
            </h2>
            <div className="space-y-3 text-sm leading-relaxed text-gray-600">
              <p>회사는 다음의 목적을 위하여 개인정보를 처리합니다.</p>
              <ul className="ml-4 list-disc space-y-2">
                <li>
                  <span className="font-medium text-ocean-500">회원가입 및 관리:</span> 회원제
                  서비스 제공에 따른 본인 식별·인증, 회원자격 유지·관리, 서비스 부정이용 방지,
                  각종 고지·통지
                </li>
                <li>
                  <span className="font-medium text-ocean-500">상품 주문 및 결제:</span> 상품
                  배송, 서비스 제공, 계약서·청구서 발송, 콘텐츠 제공, 구매 및 요금 결제, 요금
                  추심
                </li>
                <li>
                  <span className="font-medium text-ocean-500">고객 상담:</span> 민원인의 신원
                  확인, 민원사항 확인, 사실조사를 위한 연락·통지, 처리결과 통보
                </li>
                <li>
                  <span className="font-medium text-ocean-500">마케팅 및 광고:</span> 신규
                  서비스 개발 및 맞춤 서비스 제공, 이벤트 및 광고성 정보 제공, 접속빈도 파악,
                  회원의 서비스 이용 통계
                </li>
              </ul>
            </div>
          </section>

          {/* 2. 수집하는 개인정보의 항목 */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              2. 수집하는 개인정보의 항목
            </h2>
            <div className="space-y-3 text-sm leading-relaxed text-gray-600">
              <div>
                <h3 className="mb-2 font-medium text-gray-900">필수 수집 항목</h3>
                <ul className="ml-4 list-disc space-y-1">
                  <li>회원가입 시: 이름, 이메일 주소, 비밀번호, 연락처(휴대전화번호)</li>
                  <li>
                    상품 주문 시: 수령인 정보(이름, 연락처, 배송지 주소), 결제 정보
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="mb-2 font-medium text-gray-900">선택 수집 항목</h3>
                <ul className="ml-4 list-disc space-y-1">
                  <li>추가 배송지 정보, 사업자등록번호(B2B 거래 시)</li>
                </ul>
              </div>
              <div>
                <h3 className="mb-2 font-medium text-gray-900">자동 수집 항목</h3>
                <ul className="ml-4 list-disc space-y-1">
                  <li>
                    IP 주소, 쿠키, 서비스 이용 기록, 방문 기록, 기기 정보(브라우저 종류, OS
                    등)
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* 3. 개인정보의 보유 및 이용기간 */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              3. 개인정보의 보유 및 이용기간
            </h2>
            <div className="space-y-3 text-sm leading-relaxed text-gray-600">
              <p>
                회사는 법령에 따른 개인정보 보유·이용기간 또는 이용자로부터 개인정보를 수집 시에
                동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
              </p>
              <ul className="ml-4 list-disc space-y-2">
                <li>
                  <span className="font-medium text-ocean-500">
                    계약 또는 청약철회 등에 관한 기록:
                  </span>{' '}
                  5년 (전자상거래법)
                </li>
                <li>
                  <span className="font-medium text-ocean-500">
                    대금결제 및 재화 등의 공급에 관한 기록:
                  </span>{' '}
                  5년 (전자상거래법)
                </li>
                <li>
                  <span className="font-medium text-ocean-500">
                    소비자의 불만 또는 분쟁처리에 관한 기록:
                  </span>{' '}
                  3년 (전자상거래법)
                </li>
                <li>
                  <span className="font-medium text-ocean-500">웹사이트 방문 기록:</span> 3개월
                  (통신비밀보호법)
                </li>
              </ul>
            </div>
          </section>

          {/* 4. 개인정보의 제3자 제공 */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              4. 개인정보의 제3자 제공
            </h2>
            <div className="space-y-3 text-sm leading-relaxed text-gray-600">
              <p>
                회사는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만, 아래의
                경우에는 예외로 합니다.
              </p>
              <ul className="ml-4 list-disc space-y-2">
                <li>이용자가 사전에 동의한 경우</li>
                <li>
                  법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라
                  수사기관의 요구가 있는 경우
                </li>
                <li>
                  배송업무를 위해 배송업체에 배송에 필요한 최소한의 이용자 정보(수령인 이름,
                  주소, 연락처)를 제공하는 경우
                </li>
              </ul>
            </div>
          </section>

          {/* 5. 개인정보의 파기절차 및 방법 */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              5. 개인정보의 파기절차 및 방법
            </h2>
            <div className="space-y-3 text-sm leading-relaxed text-gray-600">
              <p>
                회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을
                때에는 지체 없이 해당 개인정보를 파기합니다.
              </p>
              <div>
                <h3 className="mb-2 font-medium text-gray-900">파기절차</h3>
                <p>
                  이용자가 입력한 정보는 목적 달성 후 별도의 DB에 옮겨져(종이의 경우 별도의
                  서류) 내부 방침 및 기타 관련 법령에 따라 일정기간 저장된 후 혹은 즉시
                  파기됩니다.
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-medium text-gray-900">파기방법</h3>
                <ul className="ml-4 list-disc space-y-1">
                  <li>전자적 파일 형태: 기록을 재생할 수 없는 기술적 방법을 사용하여 삭제</li>
                  <li>종이에 출력된 개인정보: 분쇄기로 분쇄하거나 소각하여 파기</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 6. 이용자의 권리와 의무 */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              6. 이용자의 권리와 의무
            </h2>
            <div className="space-y-3 text-sm leading-relaxed text-gray-600">
              <p>이용자는 회사에 대해 언제든지 다음의 권리를 행사할 수 있습니다.</p>
              <ul className="ml-4 list-disc space-y-2">
                <li>개인정보 열람 요구</li>
                <li>오류 등이 있을 경우 정정 요구</li>
                <li>삭제 요구</li>
                <li>처리정지 요구</li>
              </ul>
              <p>
                위 권리 행사는 회사에 대해 서면, 전화, 전자우편 등을 통하여 하실 수 있으며
                회사는 이에 대해 지체 없이 조치하겠습니다.
              </p>
              <p>
                이용자는 자신의 개인정보를 최신의 상태로 정확하게 입력하여 불의의 사고를
                예방하여야 합니다. 이용자가 입력한 부정확한 정보로 인해 발생하는 사고의 책임은
                이용자 자신에게 있으며, 타인 정보의 도용 등 허위정보를 입력할 경우 회원자격이
                상실될 수 있습니다.
              </p>
            </div>
          </section>

          {/* 7. 개인정보 보호책임자 */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              7. 개인정보 보호책임자
            </h2>
            <div className="space-y-3 text-sm leading-relaxed text-gray-600">
              <p>
                회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한
                이용자의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를
                지정하고 있습니다.
              </p>
              <div className="rounded-xl bg-gray-50 p-4">
                <ul className="space-y-1">
                  <li>
                    <span className="font-medium text-gray-900">개인정보 보호책임자:</span>{' '}
                    김태환 (대표)
                  </li>
                  <li>
                    <span className="font-medium text-gray-900">소속/직위:</span> 영어조합법인
                    서풍 / 대표
                  </li>
                  <li>
                    <span className="font-medium text-gray-900">주소:</span> 전라남도 여수시
                    석교로 121
                  </li>
                </ul>
              </div>
              <p>
                이용자는 회사의 서비스를 이용하면서 발생한 모든 개인정보 보호 관련 문의, 불만처리,
                피해구제 등에 관한 사항을 개인정보 보호책임자에게 문의하실 수 있습니다.
              </p>
            </div>
          </section>
        </div>

        <div className="mt-8 text-right text-sm text-gray-400">
          <p>시행일: 2026년 3월 25일</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
