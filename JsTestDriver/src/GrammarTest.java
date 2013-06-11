import com.google.jstestdriver.coverage.es3.ES3InstrumentLexer;
import com.google.jstestdriver.coverage.es3.ES3InstrumentParser;
import org.antlr.runtime.ANTLRStringStream;
import org.antlr.runtime.CommonTokenStream;

public class GrammarTest {
    public static void main (String[] args) throws Exception {
        ANTLRStringStream in = new ANTLRStringStream("{get x() {}}");
        ES3InstrumentLexer lexer = new ES3InstrumentLexer(in);
        CommonTokenStream tokens = new CommonTokenStream(lexer);
        ES3InstrumentParser parser = new ES3InstrumentParser(tokens);
        parser.objectLiteral();
    }
}
