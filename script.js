const CLIENT_ID = '';
const API_KEY = '';
const SCOPES = 'https://www.googleapis.com/auth/blogger';

let accessToken = '';
let blogId = '';

// 🌐 الترجمات — مُحدّثة باسم المشروع
const translations = {
    en: {
        titleText: "AI AutoBlog",
        loginBtn: "Sign in with Google",
        authStatus: "Signed in successfully!",
        publishSuggested: "Publish Article Now",
        alertSuccess: "Article published successfully!",
        alertError: "Error: ",
        langBtn: "العربية"
    },
    ar: {
        titleText: "AI AutoBlog",
        loginBtn: "تسجيل الدخول بحساب Google",
        authStatus: "تم تسجيل الدخول بنجاح!",
        publishSuggested: "✅ نشر المقال الآن",
        alertSuccess: "تم نشر المقال بنجاح!",
        alertError: "حدث خطأ: ",
        langBtn: "English"
    }
};

let currentLang = 'ar';

function toggleLanguage() {
    currentLang = currentLang === 'ar' ? 'en' : 'ar';
    document.body.className = currentLang;
    document.documentElement.lang = currentLang;
    updateTexts();
}

function updateTexts() {
    document.getElementById('titleText').textContent = translations[currentLang].titleText;
    document.getElementById('loginBtn').textContent = translations[currentLang].loginBtn;
    document.getElementById('langBtn').textContent = translations[currentLang].langBtn;
    document.getElementById('publishSuggested').textContent = translations[currentLang].publishSuggested;
}

document.getElementById('langBtn').addEventListener('click', toggleLanguage);

// تسجيل الدخول
document.getElementById('loginBtn').addEventListener('click', () => {
    gapi.auth2.getAuthInstance().signIn().then(() => {
        document.getElementById('authStatus').innerText = translations[currentLang].authStatus;
        document.getElementById('authSection').style.display = 'none';
        document.getElementById('postForm').style.display = 'block';
        loadBlogs();
    });
});

// تحميل المدونات
async function loadBlogs() {
    const response = await gapi.client.blogger.blogs.listByUser({ userId: 'self' });
    const blogs = response.result.items;
    blogId = blogs[0]?.id || '';
}

// 📊 استراتيجية العناوين الناجحة — مبنية على هيكل مدونتك
const successTitles = [
    { parent: 'generative', sub: 'images', weight: 5, title: 'أفضل أدوات توليد الصور بالذكاء الاصطناعي في 2025' },
    { parent: 'tools', sub: 'writing', weight: 5, title: 'أدوات كتابة المحتوى بالذكاء الاصطناعي: مقارنة شاملة' },
    { parent: 'tools', sub: 'design', weight: 5, title: 'أفضل 7 أدوات ذكاء اصطناعي للتصميم الجرافيكي في 2025' },
    { parent: 'generative', sub: 'audio', weight: 4, title: 'أفضل 5 أدوات لتوليد الصوت بالذكاء الاصطناعي للمبدعين العرب' },
    { parent: 'tools', sub: 'reviews', weight: 4, title: 'مراجعة أداة الذكاء الاصطناعي الجديدة: هل تستحق التجربة؟' },
    { parent: 'trends', sub: 'analysis', weight: 4, title: 'تحليل: كيف يُغيّر الذكاء الاصطناعي سوق العمل العربي؟' },
    { parent: 'trends', sub: 'ethics', weight: 3, title: 'هل الذكاء الاصطناعي يهدد الهوية الثقافية العربية؟' },
    { parent: 'guides', sub: 'howto', weight: 3, title: 'كيف تستخدم الذكاء الاصطناعي في كتابة منشورات السوشيال ميديا؟' },
    { parent: 'guides', sub: 'marketing', weight: 3, title: 'استراتيجيات تسويق رقمي باستخدام الذكاء الاصطناعي للشركات الصغيرة' },
    { parent: 'generative', sub: 'llms', weight: 3, title: 'نماذج اللغة الكبيرة (LLMs): دليل المبتدئين 2025' }
];

function getRandomSuccessTitle() {
    const titles = [];
    successTitles.forEach(t => {
        for (let i = 0; i < t.weight; i++) {
            titles.push(t);
        }
    });
    return titles[Math.floor(Math.random() * titles.length)];
}

function getCategoryName(parent) {
    const names = {
        trends: 'توجيهات (AI Trends)',
        generative: 'الذكاء التوليدي (Generative AI)',
        tools: 'أدوات (AI Tools)',
        guides: 'شروحات وأدلة (AI Guides)'
    };
    return names[parent] || 'أدوات';
}

function getSubcategoryName(sub) {
    const names = {
        news: 'آخر الأخبار',
        analysis: 'تحليلات وآراء',
        ethics: 'مستقبل وأخلاقيات AI',
        llms: 'النماذج اللغوية (LLMs)',
        images: 'توليد الصور والفيديو',
        audio: 'توليد الصوت والموسيقى',
        writing: 'أدوات الكتابة والمحتوى',
        design: 'أدوات التصميم والبرمجة',
        reviews: 'مراجعات ومقارنات',
        business: 'AI في الأعمال (Business)',
        marketing: 'AI للتسويق (Marketing)',
        howto: 'دروس تطبيقية (How-To)'
    };
    return names[sub] || 'مراجعة';
}

document.getElementById('suggestBtn').addEventListener('click', () => {
    const suggestion = getRandomSuccessTitle();
    
    document.getElementById('suggestedTitle').textContent = suggestion.title;
    document.getElementById('suggestedCategory').textContent = `${getCategoryName(suggestion.parent)} → ${getSubcategoryName(suggestion.sub)}`;
    document.getElementById('suggestedContent').style.display = 'block';
    window.currentSuggestion = suggestion;
});

async function generateArticleContent(title, category) {
    let content = "";

    if (category.parent === 'trends' && category.sub === 'analysis') {
        content = `
<p>في ظل التحول السريع في عالم الذكاء الاصطناعي، يُقدّم هذا التحليل رؤى عميقة حول ${title.split(' ').slice(0, 4).join(' ')} وتأثيرها على المستقبل الرقمي.</p>
<h2>التحولات الرئيسية</h2>
<ul>
  <li>التطور في النماذج اللغوية وتأثيرها على الإنتاجية</li>
  <li>التحديات التنظيمية في العالم العربي</li>
  <li>التوازن بين الابتكار والمسؤولية</li>
</ul>
<h2>الرأي: هل نحن مستعدون؟</h2>
<p>الذكاء الاصطناعي لا يُغيّر الأدوات فقط، بل يُعيد تشكيل مفاهيمنا حول العمل، الإبداع، والخصوصية.</p>
`;
    }

    else if (category.parent === 'generative' && category.sub === 'llms') {
        content = `
<p>في عام 2025، أصبحت النماذج اللغوية الكبيرة (LLMs) العمود الفقدي للعديد من التطبيقات الذكية — من المساعدات الشخصية إلى أدوات الترجمة والكتابة.</p>
<h2>أبرز التطورات</h2>
<ul>
  <li>دعم اللغة العربية بجودة متقدمة</li>
  <li>التكامل مع أدوات RAG لتحسين الدقة</li>
  <li>القدرة على فهم السياقات الثقافية</li>
</ul>
<h2>أفضل النماذج الحالية</h2>
<table style="width:100%; border-collapse: collapse; margin: 20px 0;">
  <tr><th style="border:1px solid #ddd; padding:10px;">النموذج</th><th style="border:1px solid #ddd; padding:10px;">الدقة في العربية</th><th style="border:1px solid #ddd; padding:10px;">السرعة</th></tr>
  <tr><td style="border:1px solid #ddd; padding:10px;">Qwen 2.5</td><td style="border:1px solid #ddd; padding:10px;">★★★★★</td><td style="border:1px solid #ddd; padding:10px;">★★★★☆</td></tr>
  <tr><td style="border:1px solid #ddd; padding:10px;">Gemini 2.0</td><td style="border:1px solid #ddd; padding:10px;">★★★★☆</td><td style="border:1px solid #ddd; padding:10px;">★★★★★</td></tr>
</table>
`;
    }

    else if (category.parent === 'generative' && category.sub === 'images') {
        content = `
<p>رغم أن توليد الصور بالذكاء الاصطناعي أصبح شائعًا، فإن جودة النتائج تعتمد على دقة النموذج وتدريبه على السياقات الثقافية.</p>
<h2>أفضل أدوات توليد الصور في 2025</h2>
<ul>
  <li><strong>DALL·E 3</strong>: جودة عالية، لكنها ضعيفة في السياقات العربية</li>
  <li><strong>Stable Diffusion 3</strong>: مفتوح المصدر، يدعم التعديل الدقيق</li>
  <li><strong>Midjourney v6</strong>: تفاصيل فنية ممتازة، لكنه غير متوافق مع اللغة العربية</li>
</ul>
<h2>الخلاصة</h2>
<p>الصورة ليست مجرد رسم — بل هي رسالة ثقافية. واختيار الأداة المناسبة يُحدث فرقًا كبيرًا في فعالية المحتوى العربي.</p>
`;
    }

    else if (category.parent === 'generative' && category.sub === 'audio') {
        content = `
<p>توليد الصوت والموسيقى بالذكاء الاصطناعي يُغيّر طريقة إنتاج المحتوى الصوتي — من البودكاستات إلى الإعلانات.</p>
<h2>أفضل أدوات توليد الصوت</h2>
<ul>
  <li><strong>ElevenLabs</strong>: صوت بشري مذهل، يدعم اللهجة الخليجية</li>
  <li><strong>Resemble AI</strong>: مثالي لإنشاء صوت مُخصص للعلامة التجارية</li>
  <li><strong>OpenAI TTS</strong>: دعم جيد للعربية، لكنه أقل طبيعية</li>
</ul>
<h2>الاستخدام العملي</h2>
<p>يمكنك الآن إنشاء بودكاست عربي كامل — من النص إلى الصوت — في أقل من 15 دقيقة، دون تسجيل صوتي.</p>
`;
    }

    else if (category.parent === 'tools' && category.sub === 'writing') {
        content = `
<p>أدوات توليد المحتوى بالذكاء الاصطناعي أصبحت ضرورية لكل كاتب محتوى، لكن الجودة تختلف حسب دعم اللغة والثقافة.</p>
<h2>مقارنة بين أدوات الكتابة</h2>
<table style="width:100%; border-collapse: collapse; margin: 20px 0;">
  <tr><th style="border:1px solid #ddd; padding:10px;">الأداة</th><th style="border:1px solid #ddd; padding:10px;">دعم العربية</th><th style="border:1px solid #ddd; padding:10px;">جودة المحتوى</th></tr>
  <tr><td style="border:1px solid #ddd; padding:10px;">Claude 3</td><td style="border:1px solid #ddd; padding:10px;">★★★★★</td><td style="border:1px solid #ddd; padding:10px;">★★★★★</td></tr>
  <tr><td style="border:1px solid #ddd; padding:10px;">ChatGPT</td><td style="border:1px solid #ddd; padding:10px;">★★★★☆</td><td style="border:1px solid #ddd; padding:10px;">★★★★☆</td></tr>
</table>
<h2>الخلاصة</h2>
<p>إذا كنت تكتب لمدونة عربية، فاختر أدوات تفهم السياق، وليس فقط تترجم.</p>
`;
    }

    else if (category.parent === 'tools' && category.sub === 'reviews') {
        content = `
<p>في هذا المقال، نقدم مراجعة شاملة ومحايدة لأداة الذكاء الاصطناعي المذكورة في العنوان، مع تركيز على الجوانب العملية.</p>
<h2>المميزات البارزة</h2>
<ul>
  <li>سهولة الاستخدام وواجهة مستخدم بديهية</li>
  <li>التكامل مع منصات العمل الشائعة</li>
  <li>الدعم اللغوي للعربية (مع ملاحظات حول جودته)</li>
</ul>
<h2>الأسعار وخطط الاشتراك</h2>
<table style="width:100%; border-collapse: collapse; margin: 20px 0;">
  <tr><th style="border:1px solid #ddd; padding:10px;">الخطة</th><th style="border:1px solid #ddd; padding:10px;">السعر</th><th style="border:1px solid #ddd; padding:10px;">المميزات</th></tr>
  <tr><td style="border:1px solid #ddd; padding:10px;">مجاني</td><td style="border:1px solid #ddd; padding:10px;">$0</td><td style="border:1px solid #ddd; padding:10px;">50 استخدام شهريًا</td></tr>
  <tr><td style="border:1px solid #ddd; padding:10px;">احترافي</td><td style="border:1px solid #ddd; padding:10px;">$20</td><td style="border:1px solid #ddd; padding:10px;">استخدام غير محدود</td></tr>
</table>
`;
    }

    else if (category.parent === 'guides' && category.sub === 'howto') {
        content = `
<p>في هذا الدليل العملي، نتعلم معًا كيفية تنفيذ ${title} خطوة بخطوة — حتى لو كنت مبتدئًا.</p>
<h2>الخطوة 1: التحضير</h2>
<ul>
  <li>افتح متصفح Chrome أو Edge</li>
  <li>سجّل الدخول إلى حساب Google</li>
</ul>
<h2>الخطوة 2: التنفيذ</h2>
<ol>
  <li>اذهب إلى الموقع: <a href="#" target="_blank">example.com</a></li>
  <li>اختر النموذج المناسب</li>
  <li>اكتب النص المطلوب</li>
</ol>
<h2>النتيجة</h2>
<p>في أقل من 10 دقائق، أنت تمتلك نتيجة احترافية — دون الحاجة لخبرة تقنية.</p>
`;
    }

    else {
        content = `
<p>تم إنشاء هذا المقال تلقائيًا باستخدام AI AutoBlog — روبوت محتوى الذكاء الاصطناعي. يحتوي على معلومات مُبنية على عنوانك: "${title}".</p>
<p>يمكنك تعديله لاحقًا ليناسب أسلوبك.</p>
`;
    }

    const imagePrompt = title + " — مظهر احترافي، تفاصيل دقيقة، خلفية نظيفة، بدون نصوص، بدون شعارات، بأسلوب واقعي، مناسب لمدونة ذكاء اصطناعي";
    const imageUrl = await generateImage(imagePrompt);

    return `<img src="${imageUrl}" alt="${title}" style="width:100%; max-width:800px; border-radius:12px; margin:20px 0; box-shadow:0 4px 12px rgba(0,0,0,0.1);" loading="lazy">
<h1>${title}</h1>
${content}`;
}

async function generateImage(prompt) {
    try {
        const encodedPrompt = encodeURIComponent(prompt + " — مظهر احترافي، تفاصيل دقيقة، خلفية نظيفة، بدون نصوص، بدون شعارات، بأسلوب واقعي، مناسب لمدونة ذكاء اصطناعي");
        const url = `https://image.pollinations.ai/prompt/${encodedPrompt}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("فشل توليد الصورة");
        return response.url;
    } catch (error) {
        console.warn("فشل توليد الصورة، سيتم استخدام صورة احتياطية:", error.message);
        return "https://images.unsplash.com/photo-1677442136998-5693102026d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";
    }
}

document.getElementById('publishSuggested').addEventListener('click', async () => {
    if (!window.currentSuggestion) return;

    const title = window.currentSuggestion.title;
    const category = {
        parent: window.currentSuggestion.parent,
        sub: window.currentSuggestion.sub
    };

    const content = await generateArticleContent(title, category);

    const post = {
        title: title,
        content: content,
        published: true
    };

    try {
        const response = await gapi.client.blogger.posts.insert({
            blogId: blogId,
            resource: post
        });
        alert(`تم نشر المقال بنجاح!\n\n"${title}"`);
        document.getElementById('suggestedContent').style.display = 'none';
    } catch (error) {
        alert(translations[currentLang].alertError + error.result.error.message);
    }
});

function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/blogger/v3/rest"],
        scope: SCOPES
    }).then(() => {
        updateTexts();
    });
}

window.onload = () => {
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = initClient;
    document.head.appendChild(script);

};

