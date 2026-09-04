package link.bolo.app

import android.annotation.SuppressLint
import android.app.DownloadManager
import android.content.Context
import android.content.Intent
import android.graphics.Bitmap
import android.net.Uri
import android.os.Bundle
import android.os.Environment
import android.util.Base64
import android.view.View
import android.webkit.*
import android.widget.Toast
import androidx.activity.OnBackPressedCallback
import androidx.appcompat.app.AppCompatActivity
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout
import java.io.File
import java.io.FileOutputStream

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private lateinit var swipeRefresh: SwipeRefreshLayout
    private val appUrl = "https://bo-lo.vercel.app"

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Setup UI
        swipeRefresh = SwipeRefreshLayout(this)
        webView = WebView(this)
        swipeRefresh.addView(webView)
        setContentView(swipeRefresh)

        // Configure SwipeRefreshLayout
        swipeRefresh.setColorSchemeColors(0xFFEC4899.toInt(), 0xFFF43F5E.toInt())
        swipeRefresh.setProgressBackgroundColorSchemeColor(0xFF18181B.toInt())
        swipeRefresh.setOnRefreshListener {
            webView.reload()
        }

        // Enable Cookies
        val cookieManager = CookieManager.getInstance()
        cookieManager.setAcceptCookie(true)
        cookieManager.setAcceptThirdPartyCookies(webView, true)

        // Configure WebView
        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            databaseEnabled = true
            useWideViewPort = true
            loadWithOverviewMode = true
            cacheMode = WebSettings.LOAD_DEFAULT
            userAgentString = "$userAgentString BoloAndroidApp/1.0"
        }

        webView.setBackgroundColor(0xFF09090B.toInt())

        // Handle WebView Navigation
        webView.webViewClient = object : WebViewClient() {
            override fun onPageStarted(view: WebView?, url: String?, favicon: Bitmap?) {
                super.onPageStarted(view, url, favicon)
                swipeRefresh.isRefreshing = true
            }

            override fun onPageFinished(view: WebView?, url: String?) {
                super.onPageFinished(view, url)
                swipeRefresh.isRefreshing = false
                cookieManager.flush()
            }

            override fun shouldOverrideUrlLoading(
                view: WebView?,
                request: WebResourceRequest?
            ): Boolean {
                val url = request?.url?.toString() ?: return false

                // Handle external apps (WhatsApp, Instagram, mailto, etc.)
                if (url.startsWith("whatsapp:") || url.startsWith("intent:") ||
                    url.startsWith("instagram:") || url.startsWith("mailto:")
                ) {
                    try {
                        val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
                        startActivity(intent)
                        return true
                    } catch (e: Exception) {
                        return false
                    }
                }
                return false
            }
        }

        webView.webChromeClient = object : WebChromeClient() {}

        // Handle Download requests (e.g. Instagram Story PNG export)
        webView.setDownloadListener { url, _, _, mimetype, _ ->
            if (url.startsWith("data:")) {
                saveDataUriImage(url)
            } else {
                val request = DownloadManager.Request(Uri.parse(url)).apply {
                    setMimeType(mimetype)
                    setTitle("Bolo Story")
                    setDescription("Downloading Instagram Story card...")
                    setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED)
                    setDestinationInExternalPublicDir(
                        Environment.DIRECTORY_PICTURES,
                        "bolo-story-${System.currentTimeMillis()}.png"
                    )
                }
                val manager = getSystemService(Context.DOWNLOAD_SERVICE) as DownloadManager
                manager.enqueue(request)
                Toast.makeText(this, "Downloading story card...", Toast.LENGTH_SHORT).show()
            }
        }

        // Hardware back button support
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (webView.canGoBack()) {
                    webView.goBack()
                } else {
                    finish()
                }
            }
        })

        // Load the live app
        webView.loadUrl(appUrl)
    }

    private fun saveDataUriImage(dataUri: String) {
        try {
            val base64Data = dataUri.substringAfter("base64,")
            val decodedBytes = Base64.decode(base64Data, Base64.DEFAULT)
            val picturesDir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_PICTURES)
            val file = File(picturesDir, "bolo-story-${System.currentTimeMillis()}.png")
            FileOutputStream(file).use { it.write(decodedBytes) }
            Toast.makeText(this, "Saved to Pictures!", Toast.LENGTH_SHORT).show()
        } catch (e: Exception) {
            Toast.makeText(this, "Failed to save image", Toast.LENGTH_SHORT).show()
        }
    }
}
